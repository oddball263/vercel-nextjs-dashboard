'use server';

/* --------
    2. By adding the 'use server', you mark all the exported functions within the file as server functions. 
    These server functions can then be imported into Client and Server components, making them extremely versatile.

    3. createInvoice(formData: FormData) :
      - Extract the data from formData
      - There are a couple of methods you can use. 
      - For this example, let's use the .get(name) method.

    4. Validate and prepare the data
      - Before sending the form data to your database, 
      you want to ensure it's in the correct format and with the correct types. 
    
      - If you remember from earlier in the course, your invoices table expects data in the following format:
        
          From app/lib/definitions.ts

            type Invoice = {
                id: string; // Will be created on the database
                customer_id: string;
                amount: number; // Stored in cents
                status: 'pending' | 'paid';
                date: string;
            };
-------- */

export async function createInvoice(formData: FormData) {
  // get...
  const rawFormData = {
    customerId: formData.get('customerId'),
    amount: formData.get('amount'),
    status: formData.get('status'),
  };
  // Test it out:
  console.log('rawFormData', rawFormData);
  // test 2
  const rawFormEntries = Object.fromEntries(formData.entries());
  console.log('rawFormEntries', rawFormEntries);

  // 4. validate, prepare data
}
