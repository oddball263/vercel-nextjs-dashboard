'use server';

import { z } from 'zod';
import { sql } from '@vercel/postgres';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

// for Authenticate
import { signIn } from '@/auth';
import { AuthError } from 'next-auth';

/* --------
    2. By adding the 'use server', you mark all the exported functions within the file as server functions. 
    These server functions can then be imported into Client and Server components, making them extremely versatile.

    3. createInvoice(formData: FormData) :
      - Extract the data from formData

      1. Get data from formObject using the formData.get('amount') method
        const rawFormData = {
          customerId: formData.get('customerId'),
          amount: formData.get('amount'),
          status: formData.get('status'),
        };
        console.log('rawFormData', rawFormData);

      2. Get data from formObject using Object.fromEntries 
        const rawFormEntries = Object.fromEntries(formData.entries());
        console.log('rawFormEntries', rawFormEntries);

    4. Validate and prepare the data using 'Zod'
      - Before sending ensure data is in correct format and with the correct types. 
      - From app/lib/definitions.ts - 'typescript type' of foemData

        type Invoice = {
            id: string; // Will be created on the database
            customer_id: string;
            amount: number; // Stored in cents
            status: 'pending' | 'paid';
            date: string;
        };
-------- */
// Zod schema ---
const FormSchema = z.object({
  id: z.string(),
  customerId: z.string(),
  amount: z.coerce.number(),
  status: z.enum(['pending', 'paid']),
  date: z.string(),
});
// Use Zod to update the expected types
const CreateInvoice = FormSchema.omit({ id: true, date: true });
const UpdateInvoice = FormSchema.omit({ id: true, date: true });

// 1. Create
export async function createInvoice(formData: FormData) {
  // Get and Validate, prepare data
  const { customerId, amount, status } = CreateInvoice.parse({
    customerId: formData.get('customerId'),
    amount: formData.get('amount'),
    status: formData.get('status'),
  });
  const amountInCents = amount * 100;
  const date = new Date().toISOString().split('T')[0];

  // Insert into database
  try {
    await sql`
      INSERT INTO invoices (customer_id, amount, status, date)
      VALUES (${customerId}, ${amountInCents}, ${status}, ${date})
    `;
  } catch (error) {
    return {
      message: 'Database Error: Failed to Create Invoice.',
    };
  }

  // After updating --- revise route cache so Invoices will refetch data - navigate to invoices.
  revalidatePath('/dashboard/invoices');
  redirect('/dashboard/invoices');
}

// 2. Update ---
export async function updateInvoice(id: string, formData: FormData) {
  const { customerId, amount, status } = UpdateInvoice.parse({
    customerId: formData.get('customerId'),
    amount: formData.get('amount'),
    status: formData.get('status'),
  });

  const amountInCents = amount * 100;

  try {
    await sql`
        UPDATE invoices
        SET customer_id = ${customerId}, amount = ${amountInCents}, status = ${status}
        WHERE id = ${id}
      `;
  } catch (error) {
    return { message: 'Database Error: Failed to Update Invoice.' };
  }

  revalidatePath('/dashboard/invoices');
  redirect('/dashboard/invoices');
}

//3. Delete ---
export async function deleteInvoice(id: string) {
  //throw new Error('Failed to Delete Invoice');

  try {
    await sql`DELETE FROM invoices WHERE id = ${id}`;
    revalidatePath('/dashboard/invoices');
    return { message: 'Deleted Invoice.' };
  } catch (error) {
    return { message: 'Database Error: Failed to Delete Invoice.' };
  }
}
// 4. Authenticate ---
export async function authenticate(
  prevState: string | undefined,
  formData: FormData,
) {
  try {
    await signIn('credentials', formData);
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case 'CredentialsSignin':
          return 'Invalid credentials.';
        default:
          return 'Something went wrong.';
      }
    }
    throw error;
  }
}
