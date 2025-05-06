import {
    FETCH_AGENTS_REQUEST,
    FETCH_AGENTS_SUCCESS,
    FETCH_AGENTS_FAILURE,
    SELECT_AGENT
  } from '../actions/agentActions';
  
  const initialState = {
    agents: [],
    selectedAgent: null,
    loading: false,
    error: null
  };
  
  const agentReducer = (state = initialState, action) => {
    switch (action.type) {
      case FETCH_AGENTS_REQUEST:
        return {
          ...state,
          loading: true,
          error: null
        };
      
      case FETCH_AGENTS_SUCCESS:
        return {
          ...state,
          loading: false,
          agents: action.payload,
          error: null
        };
      
      case FETCH_AGENTS_FAILURE:
        return {
          ...state,
          loading: false,
          error: action.payload
        };
      
      case SELECT_AGENT:
        // Save to localStorage whenever an agent is selected
        localStorage.setItem('selectedAgentId', action.payload.agentId);
        return {
          ...state,
          selectedAgent: action.payload
        };
      
      default:
        return state;
    }
  };
  
  export default agentReducer;
  