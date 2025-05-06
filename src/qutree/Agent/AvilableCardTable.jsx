import React, { useEffect, useState } from 'react';
import api from '../api';

export function AvilableCardTable() {
  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCards, setSelectedCards] = useState([]);
  const [pendingReturns, setPendingReturns] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userId = localStorage.getItem('userId');
        const [cardsResponse, returnsResponse] = await Promise.all([
          api.get(`/user-card-ids/${userId}/cards/status/ASSIGNED`),
          api.get(`/cards/returns/agent/${userId}`)
        ]);
        
        setCards(cardsResponse.data);
        setPendingReturns(returnsResponse.data.map(item => item.cardId));
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleCheckboxChange = (cardId) => {
    setSelectedCards(prev => {
      if (prev.includes(cardId)) {
        return prev.filter(id => id !== cardId);
      } else {
        return [...prev, cardId];
      }
    });
  };

  const handleSelectAll = (checked) => {
    if (checked) {
      const availableCards = cards
        .filter(card => !pendingReturns.includes(card.id))
        .map(card => card.id);
      setSelectedCards(availableCards);
    } else {
      setSelectedCards([]);
    }
  };

  const handleReturnCards = async () => {
    try {
      const agentId = localStorage.getItem('userId');
      await api.post('/cards/returns/request', {
        cardIds: selectedCards,
        agentId: parseInt(agentId)
      });
      
      // Refresh both cards and pending returns data
      const [cardsResponse, returnsResponse] = await Promise.all([
        api.get(`/user-card-ids/${agentId}/cards/status/ASSIGNED`),
        api.get(`/cards/returns/agent/${agentId}`)
      ]);
      
      setCards(cardsResponse.data);
      setPendingReturns(returnsResponse.data.map(item => item.cardId));
      setSelectedCards([]);
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) return <div className="p-4 text-center">Loading...</div>;
  if (error) return <div className="p-4 text-center text-red-500">Error: {error}</div>;

  return (
    <div className="ml-[250px] w-[calc(100%-450px)]">
      <div className="flex justify-between items-center mt-8">
        <div className="text-2xl font-semibold">Active Cards</div>
        {selectedCards.length > 0 && (
          <button
            onClick={handleReturnCards}
            className="px-4 py-2 text-sm bg-gradient-to-r from-[#016681] to-[#0CBFFF] text-white rounded hover:bg-[#023444] disabled:bg-[#357E95] transition-colors"
          >
            Return Selected Cards
          </button>
        )}
      </div>
      <div className="mt-2 border flex overflow-hidden overflow-x-auto flex-wrap items-start bg-white max-md:max-w-full">
        <TableColumn 
          header={
            <input
              type="checkbox"
              onChange={(e) => handleSelectAll(e.target.checked)}
              checked={selectedCards.length > 0 && selectedCards.length === cards.filter(card => !pendingReturns.includes(card.id)).length}
              className="w-4 h-4 cursor-pointer"
            />
          }
          accessor="checkbox" 
          width="60px" 
          data={cards}
          onCheckboxChange={handleCheckboxChange}
          selectedCards={selectedCards}
          pendingReturns={pendingReturns}
        />
        <TableColumn header="ID" accessor="id" width="88px" data={cards} />
        <TableColumn header="Card ID" accessor="userCardId" width="129px" data={cards} />
        <TableColumn header="Status" accessor="status" width="129px" data={cards} pendingReturns={pendingReturns} />
        <TableColumn header="Created At" accessor="createdAt" width="188px" data={cards} />
        <TableColumn header="Assigned At" accessor="assignedAt" width="188px" data={cards} />
        <TableColumn header="NFC" accessor="qrCodeType" width="188px" data={cards} />
      </div>
    </div>
  );
}

function TableColumn({ header, accessor, width, data, onCheckboxChange, selectedCards, pendingReturns = [] }) {
  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  const formatValue = (item, accessor) => {
    if (accessor === 'checkbox') {
      const isPending = pendingReturns.includes(item.id);
      return (
        <input
          type="checkbox"
          checked={selectedCards?.includes(item.id)}
          onChange={() => onCheckboxChange(item.id)}
          className="w-4 h-4 cursor-pointer"
          disabled={isPending}
        />
      );
    }
    if (accessor === 'status') {
      if (pendingReturns.includes(item.id)) {
        return (
          <div className="flex items-center justify-center">
            <span className="px-2 py-1 text-xs bg-yellow-100 text-yellow-800 rounded">
              Return Pending
            </span>
          </div>
        );
      }
      return item[accessor];
    }
    if (accessor.includes('At')) {
      return formatDate(item[accessor]);
    }
    return item[accessor];
  };

  return (
    <div
      className="flex flex-col grow shrink text-sm text-slate-600"
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
          {formatValue(item, accessor)}
        </div>
      ))}
    </div>
  );
}

export default AvilableCardTable;