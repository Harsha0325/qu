import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchAgentsRequest, selectAgent } from '../../Redux/actions/agentActions';
import { User } from 'lucide-react';
import { MyAgentsDashboard } from './Agentdashboard/MyAgentsDashboard';

const AgentDashboard = () => {
  const dispatch = useDispatch();
  const agents = useSelector(state => state.agents);
  const selectedAgent = useSelector(state => state.selectedAgent);
  const loading = useSelector(state => state.loading);
  const error = useSelector(state => state.error);

  useEffect(() => {
    if (agents.length === 0) {
      dispatch(fetchAgentsRequest());
    }
  }, [dispatch, agents.length]);

  const handleAgentClick = (agent) => {
    dispatch(selectAgent(agent));
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="flex h-screen bg-gray-100 ml-[250px] w-[calc(100%-250px)] overflow-hidden">
      <div className="w-96 min-w-[320px] flex flex-col bg-white border-r overflow-hidden">
        <div className="p-4 bg-gray-50 border-b flex-shrink-0">
          <h2 className="text-xl font-semibold">Agents</h2>
        </div>
        <div className="flex-1 overflow-y-auto scrollbar-hide">
          {agents.map((agent) => (
            <div
              key={agent.agentId}
              onClick={() => handleAgentClick(agent)}
              className={`p-4 hover:bg-gray-50 cursor-pointer border-b ${
                selectedAgent?.agentId === agent.agentId ? 'bg-gray-100' : ''
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-full bg-blue-100 flex-shrink-0 flex items-center justify-center">
                  <User className="h-6 w-6 text-blue-500" />
                </div>
                <div className="min-w-0">
                  <h3 className="font-medium truncate">{agent.agentName}</h3>
                  <p className="text-sm text-gray-500 truncate">ID: {agent.agentId}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-hidden">
        {selectedAgent ? (
          <div className="h-full overflow-y-auto scrollbar-hide">
            <MyAgentsDashboard key={selectedAgent.agentId} userId={selectedAgent.agentId} />
          </div>
        ) : (
          <div className="h-full flex items-center justify-center">
            <p className="text-gray-500">Select an agent to view details</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AgentDashboard;


// import React, { useState, useEffect } from 'react';
// import { User } from 'lucide-react';
// import api from '../api';
// import { CommunityDashboard } from './Agentdashboard/CommunityDashboard';

// const AgentDashboard = () => {
//   const [agents, setAgents] = useState([]);
//   const [selectedAgent, setSelectedAgent] = useState(null);
  
//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const response = await api.get('/user-card-ids/admin/allagents');
//         setAgents(response.data);
//         if (response.data.length > 0) {
//           setSelectedAgent(response.data[0]);
//         }
//       } catch (error) {
//         console.error('Error fetching data:', error);
//       }
//     };
    
//     fetchData();
//   }, []);

//   const handleAgentClick = (agent) => {
//     setSelectedAgent(agent);
//   };
  

//   return (
//     <div className="flex h-screen bg-gray-100 ml-[250px] w-[calc(100%-250px)] overflow-hidden">
//       <div className="w-96 min-w-[320px] flex flex-col bg-white border-r overflow-hidden">
//         <div className="p-4 bg-gray-50 border-b flex-shrink-0">
//           <h2 className="text-xl font-semibold">Agents</h2>
//         </div>
//         <div className="flex-1 overflow-y-auto scrollbar-hide">
//           {agents.map((agent) => (
//             <div
//               key={agent.agentId}
//               onClick={() => handleAgentClick(agent)}
//               className={`p-4 hover:bg-gray-50 cursor-pointer border-b ${
//                 selectedAgent?.agentId === agent.agentId ? 'bg-gray-100' : ''
//               }`}
//             >
//               <div className="flex items-center gap-3">
//                 <div className="h-12 w-12 rounded-full bg-blue-100 flex-shrink-0 flex items-center justify-center">
//                   <User className="h-6 w-6 text-blue-500" />
//                 </div>
//                 <div className="min-w-0">
//                   <h3 className="font-medium truncate">{agent.agentName}</h3>
//                   <p className="text-sm text-gray-500 truncate">ID: {agent.agentId}</p>
//                 </div>
//               </div>
//             </div>
//           ))}
//         </div>
//       </div>
      

//       <div className="flex-1 overflow-hidden">
//         {selectedAgent ? (
//           <div className="h-full overflow-y-auto scrollbar-hide">
//             <CommunityDashboard key={selectedAgent.agentId} userId={selectedAgent.agentId} />
//           </div>
//         ) : (
//           <div className="h-full flex items-center justify-center">
//             <p className="text-gray-500">Select an agent to view details</p>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default AgentDashboard;

