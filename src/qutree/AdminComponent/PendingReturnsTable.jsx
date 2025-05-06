import React, { useState, useEffect } from 'react';
import api from '../api';
import { DataGrid } from '@mui/x-data-grid';
import { Check, Loader2 } from 'lucide-react';

const PendingReturnsTable = () => {
  const [returns, setReturns] = useState([]);
  const [selectedIds, setSelectedIds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [approving, setApproving] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    fetchReturns();
  }, []);

  const fetchReturns = async () => {
    try {
      const response = await api.get(`/cards/returns/pending`);
      setReturns(response.data);
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async () => {
    if (selectedIds.length === 0) return;

    setApproving(true);
    try {
      await api.post(`/cards/returns/batch-approve`, {
        requestIds: selectedIds,
      });

      setSuccess(true);
      await fetchReturns();
      setSelectedIds([]);

      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    } finally {
      setApproving(false);
    }
  };

  const columns = [
    {
      field: 'cardNumber',
      headerName: 'Card Number',
      flex: 1,
      minWidth: 150,
    },
    {
      field: 'agentName',
      headerName: 'Agent Name',
      flex: 1,
      minWidth: 150,
    },
    {
      field: 'status',
      headerName: 'Status',
      flex: 1,
      minWidth: 120,
      renderCell: (params) => (
        <span className="inline-flex px-2 py-1 text-xs font-medium rounded-full bg-yellow-100 text-yellow-800">
          {params.value}
        </span>
      ),
    },
    {
      field: 'requestedAt',
      headerName: 'Requested At',
      flex: 1,
      minWidth: 180,
      valueFormatter: (params) => new Date(params.value).toLocaleString(),
    },
  ];

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative">
        {error}
      </div>
    );
  }

  return (
    <div className=" w-full min-h-screen bg-gray-50">
      <div className="space-y-4">
        {success && (
          <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded">
            Successfully approved !
          </div>
        )}

        <div style={{  width: '100%' }}>
          
          <DataGrid
            rows={returns}
            columns={columns}
            pageSize={5}
            rowsPerPageOptions={[5, 10, 20]}
            checkboxSelection
            disableSelectionOnClick
            loading={loading}
            onRowSelectionModelChange={(newSelection) => {
              setSelectedIds(newSelection);
            }}
            rowSelectionModel={selectedIds}
            density="comfortable"
            sx={{
              '& .MuiDataGrid-cell:focus': {
                outline: 'none',
              },
              border: '1px solid #E5E7EB',
              borderRadius: '0.5rem',
              '& .MuiDataGrid-columnHeader': {
                backgroundColor: '#F9FAFB',
                color: '#4B5563',
                fontWeight: 600,
              },
              '& .MuiDataGrid-row:hover': {
                backgroundColor: '#F9FAFB',
              },
            }}
          />
        </div>
        {selectedIds.length > 0 && (
          <div className="flex justify-end mt-4">
            <button
              onClick={handleApprove}
              disabled={approving}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-gradient-to-r from-[#016681] to-[#0CBFFF]   hover:bg-[#023444] disabled:bg-[#357E95] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {approving ? (
                <Loader2 className="w-4 h-4 animate-spin mr-2" />
              ) : (
                <Check className="w-4 h-4 mr-2" />
              )}
              Approve Selected Cards ({selectedIds.length})
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default PendingReturnsTable;
