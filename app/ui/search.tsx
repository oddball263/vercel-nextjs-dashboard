'use client';

import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
//
import { useSearchParams, usePathname, useRouter } from 'next/navigation';

/*-------

  1. ${pathname} is the current path, in your case, "/dashboard/invoices".
  
  2. As the user types into the search bar, params.toString() translates this input into a URL-friendly format.

  3. replace(${pathname}?${params.toString()}) updates the URL with the user's search data. For example, /dashboard/invoices?query=lee if the user searches for "Lee".

  4. The URL is updated without reloading the page, thanks to Next.js's client-side navigation (which you learned about in the chapter on navigating between pages.
  
  5. To ensure the input field is in sync with the URL and will be populated when sharing, you can pass a defaultValue to input by reading from searchParams:
 
    --------- */

export default function Search() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  function handleSearch(term: string) {
    console.log('term', term);
    const params = new URLSearchParams(searchParams);
    // reset pagination to page 1
    params.set('page', '1');

    if (term) {
      params.set('query', term);
    } else {
      params.delete('query');
    }
    replace(`${pathname}?${params.toString()}`);
  }

  const getLog = () => {
    console.log('Search rendering...');
    return '';
  };

  return (
    <div style={{ width: '75%' }}>
      <label htmlFor="search" className="sr-only">
        Search
        {getLog()}
      </label>
      <div>
        <p style={{ paddingBottom: '10px' }}>
          Search functionality will span the client and the server.{' '}
        </p>
        <p style={{ paddingBottom: '10px' }}>
          The URL params will be updated on every input change using function
          handleSearch(term: string), params.set(query, term);.
        </p>

        <p>
          The route will update, /invoices/page.tsx/ will re-render on server,
          and table.tsx will re-render on server.
        </p>
      </div>
      <div className="relative flex flex-1 flex-shrink-0">
        <input
          className="peer block w-full rounded-md border border-gray-200 py-[9px] pl-10 text-sm outline-2 placeholder:text-gray-500"
          //placeholder={placeholder}
          onChange={(e) => {
            handleSearch(e.target.value);
          }}
          defaultValue={searchParams.get('query')?.toString()}
        />

        <MagnifyingGlassIcon className="absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
      </div>
    </div>
  );
}
