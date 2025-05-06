import React, { useState, useEffect } from 'react';
import api from '../../api';
import {
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  flexRender,
} from '@tanstack/react-table';


const UserCardTable = ({userId}) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const columns = [
    {
      header: 'Full Name',
      accessorKey: 'fullName',
    },
    {
      header: 'Card ID',
      accessorKey: 'userQCardId',
    },
    {
      header: 'Job Title',
      accessorKey: 'jobTitle',
    },
    {
      header: 'Contact',
      accessorFn: (row) => {
        const phone = row.phone?.[0] || '';
        const email = row.email?.[0] || '';
        return `${phone}\n${email}`;
      },
      cell: ({ getValue }) => {
        const value = getValue();
        const [phone, email] = value.split('\n');
        return (
          <div className="space-y-1">
            <div className="text-sm">{phone}</div>
            <div className="text-xs text-gray-500">{email}</div>
          </div>
        );
      },
    },
    {
      header: 'Company',
      accessorKey: 'companyName',
      cell: ({ getValue }) => getValue() || '-',
    },
  ];

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/user-card-ids/details/${userId}`);
      const sortedData = response.data.sort((a, b) => b.id - a.id);
      setData(sortedData);
      setError(null);
    } catch (err) {
      setError('Failed to fetch user card details');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: {
      pagination: {
        pageSize: 5,
      },
    },
  });

  if (loading) {
    return (
      <div className="w-full bg-white rounded-lg shadow">
        <div className="p-6">
          <div className="flex justify-center items-center h-40">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full bg-white rounded-lg shadow">
        <div className="p-6">
          <div className="text-red-500 text-center">{error}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full bg-white rounded-lg shadow">
      <div className="px-6 py-4 border-b border-gray-200">
        <h2 className="text-xl font-semibold text-gray-800">User Card Details</h2>
      </div>
      
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            {table.getHeaderGroups().map(headerGroup => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map(header => (
                  <th
                    key={header.id}
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    {flexRender(
                      header.column.columnDef.header,
                      header.getContext()
                    )}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {table.getRowModel().rows.map(row => (
              <tr key={row.id} className="hover:bg-gray-50">
                {row.getVisibleCells().map(cell => (
                  <td
                    key={cell.id}
                    className="px-6 py-4 whitespace-nowrap"
                  >
                    {flexRender(
                      cell.column.columnDef.cell,
                      cell.getContext()
                    )}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      <div className="px-6 py-3 border-t border-gray-200 bg-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
              className="px-4 py-2 text-sm bg-[#066882] text-white rounded-md  hover:bg-[#023444] disabled:bg-[#357E95] disabled:cursor-not-allowed"
            >
              Previous
            </button>
            <span className="text-sm text-gray-600">
              Page {table.getState().pagination.pageIndex + 1} of{' '}
              {table.getPageCount()}
            </span>
            <button
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
              className="px-4 py-2 text-sm bg-[#066882] text-white rounded-md  hover:bg-[#023444] disabled:bg-[#357E95] disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserCardTable;