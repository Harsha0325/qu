import React, { useState, useEffect } from 'react';
import api from '../api'
import QRCodeGenerator from './QRCodeGenerator';


const CardManagement = () => {
  const [agents, setAgents] = useState([]);
  const [unassignedCards, setUnassignedCards] = useState([]);
  const [selectedCards, setSelectedCards] = useState([]);
  const [selectedAgent, setSelectedAgent] = useState('');
  const [cardCount, setCardCount] = useState(10);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    fetchAgents();
    fetchUnassignedCards();
  }, []);

  const fetchAgents = async () => {
    try {
      const response = await api.get('/agents');
      setAgents(response.data);
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to fetch agents' });
    }
  };

  const fetchUnassignedCards = async () => {
    try {
      const response = await api.get('/user-card-ids/unassigned');
      setUnassignedCards(response.data);
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to fetch unassigned cards' });
    }
  };

  const generateCards = async () => {
    setLoading(true);
    try {
      const response = await api.post(`/generate-ids?count=${cardCount}`);
      if (response.status === 200) {
        setMessage({ type: 'success', text: `Successfully generated ${cardCount} cards` });
        fetchUnassignedCards();
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to generate cards' });
    }
    setLoading(false);
  };

  const assignCards = async () => {
    if (!selectedAgent || selectedCards.length === 0) {
      setMessage({ type: 'error', text: 'Please select an agent and cards' });
      return;
    }

    setLoading(true);
    try {
      const response = await api.put('/user-card-ids/assign', {
        cardIds: selectedCards,
        agentId: parseInt(selectedAgent)
      });

      if (response.status === 200) {
        setMessage({ type: 'success', text: 'Cards assigned successfully' });
        setSelectedCards([]);
        fetchUnassignedCards();
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to assign cards' });
    }
    setLoading(false);
  };

  const handleBulkSelect = (count) => {
    const cardIds = unassignedCards.slice(0, count).map(card => card.id);
    setSelectedCards(cardIds);
  };

  return (
    <div className=" w-full min-h-screen bg-gray-50">
      <div className="p-6">
        <div className="bg-white rounded-lg shadow-md mb-6 p-6">
         <QRCodeGenerator fetchUnassignedCards={fetchUnassignedCards}/>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold mb-4">Assign Cards to Agent</h2>
          <div className="flex flex-col gap-4">



  <div className="flex gap-4 items-center">
  <select
    value={selectedAgent}
    onChange={(e) => setSelectedAgent(e.target.value)}
    className="w-[300px] p-2 h-12 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 "
  >
    <option value="">Select an agent</option>
    {agents.map((agent) => (
      <option key={agent.id} value={agent.id}>
        {agent.name}
      </option>
    ))}
  </select>
  <button
    onClick={assignCards}
    disabled={loading || !selectedAgent || selectedCards.length === 0}
    className="w-[300px] h-12 px-6 py-2 bg-gradient-to-r from-[#016681] to-[#0CBFFF] text-white rounded-lg hover:bg-[#023444] disabled:bg-[#357E95] disabled:cursor-not-allowed transition-colors"
  >
    {loading ? 'Assigning...' : `Assign ${selectedCards.length} Cards`}
  </button>
</div>



            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setSelectedCards([])}
                className="px-4 py-2 text-sm bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
              >
                Clear Selection
              </button>
              <button
                onClick={() => handleBulkSelect(10)}
                className="px-4 py-2 text-sm bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200"
              >
                Select First 10
              </button>
              <button
                onClick={() => handleBulkSelect(20)}
                className="px-4 py-2 text-sm bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200"
              >
                Select First 20
              </button>
              <button
                onClick={() => handleBulkSelect(50)}
                className="px-4 py-2 text-sm bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200"
              >
                Select First 50
              </button>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {unassignedCards.map((card) => (
                <div
                  key={card.id}
                  onClick={() => {
                    setSelectedCards(prev =>
                      prev.includes(card.id)
                        ? prev.filter(id => id !== card.id)
                        : [...prev, card.id]
                    );
                  }}
                  className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                    selectedCards.includes(card.id)
                      ? 'bg-blue-100 border-blue-500'
                      : 'hover:bg-gray-50'
                  }`}
                >
                  <p className="font-medium">{card.userCardId}</p>
                  <p className="text-sm text-gray-500">
                    Created: {new Date(card.createdAt).toLocaleDateString()}
                  </p>
                </div>
              ))}
            </div>

            {/* <button 
              onClick={assignCards}
              disabled={loading || !selectedAgent || selectedCards.length === 0}
              className="w-[300px] mt-4 px-6 py-2 bg-gradient-to-r from-[#016681] to-[#0CBFFF] text-white rounded-lg  hover:bg-[#023444] disabled:bg-[#357E95] disabled:cursor-not-allowed transition-colors"
            >
              {loading ? 'Assigning...' : `Assign ${selectedCards.length} Cards`}
            </button> */}
          </div>
        </div>

        {message.text && (
          <div className={`mt-4 p-4 rounded-lg ${
            message.type === 'error' 
              ? 'bg-red-100 text-red-700 border border-red-200' 
              : 'bg-green-100 text-green-700 border border-green-200'
          }`}>
            {message.text}
          </div>
        )}
      </div>
    </div>
  );
};

export default CardManagement;