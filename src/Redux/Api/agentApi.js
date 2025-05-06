import api from '../../qutree/api.js';
import {
  FETCH_AGENTS_REQUEST,
  fetchAgentsSuccess,
  fetchAgentsFailure,
  selectAgent
} from '../actions/agentActions.js';

//middleware
const agentApi = store => next => async action => {
    next(action);
  
    if (action.type === FETCH_AGENTS_REQUEST) {
      try {
        const response = await api.get('/user-card-ids/admin/allagents');
        const agents = response.data;
        
        // First dispatch the success action to update agents list
        store.dispatch(fetchAgentsSuccess(agents));
        
        if (agents.length > 0) {
          // Select first agent by default
          let selectedAgent = agents[0];
          
          // Check if there's a saved selection
          const savedAgentId = localStorage.getItem('selectedAgentId');
          if (savedAgentId) {
            const savedAgent = agents.find(agent => agent.agentId === savedAgentId);
            if (savedAgent) {
              selectedAgent = savedAgent;
            }
          }
          
          // Dispatch the selection
          store.dispatch(selectAgent(selectedAgent));
        }
        
      } catch (error) {
        store.dispatch(fetchAgentsFailure(error.message));
      }
    }
  };

export default agentApi;