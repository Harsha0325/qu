import React, { useEffect, useState } from 'react';
import api from '../api'

export function CardTableactive() {
  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCards = async () => {
      try {
        const userId = localStorage.getItem('userId');
        const response = await api.get(`/user-card-ids/${userId}/cards/status/ACTIVE`);
        setCards(response.data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchCards();
  }, []);

  if (loading) return <div className="p-4 text-center">Loading...</div>;
  if (error) return <div className="p-4 text-center text-red-500">Error: {error}</div>;

  return (
  <div className="ml-[250px] w-[calc(100%-450px)]">
    <div className='text-2xl font-semibold mt-8'>Active Cards</div>
      <div className="mt-2 border flex overflow-hidden overflow-x-auto flex-wrap items-start bg-white max-md:max-w-full">
        <TableColumn header="ID" accessor="id" width="88px" data={cards} />
        <TableColumn header="Card ID" accessor="userCardId" width="129px" data={cards} />
        <TableColumn header="Status" accessor="status" width="99px" data={cards} />
        <TableColumn header="Created At" accessor="createdAt" width="188px" data={cards} />
        <TableColumn header="Assigned At" accessor="assignedAt" width="188px" data={cards} />
      </div>
    </div>
    
  );
}

function TableColumn({ header, accessor, width, data }) {
  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  const formatValue = (value, accessor) => {
    if (accessor.includes('At')) {
      return formatDate(value);
    }
    return value;
  };

  return (
    <div
      className={`flex flex-col grow shrink text-sm text-slate-600`}
      style={{ width }}
    >
      <div className="flex justify-center items-center px-6 py-3.5 w-full text-xs font-medium bg-gray-50 border-b border-solid border-b-gray-200 min-h-[44px] max-md:px-5">
        <div>{header}</div>
      </div>
      {data.map((item) => (
        <div
          key={item.id}
          className="flex justify-center items-center px-6 py-4 w-full text-center leading-none border-b border-solid border-b-gray-200 min-h-[72px] max-md:px-5"
        >
          {formatValue(item[accessor], accessor)}
        </div>
      ))}
    </div>
  );
}


export default CardTableactive;