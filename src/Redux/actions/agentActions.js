export const FETCH_AGENTS_REQUEST = 'FETCH_AGENTS_REQUEST';
export const FETCH_AGENTS_SUCCESS = 'FETCH_AGENTS_SUCCESS';
export const FETCH_AGENTS_FAILURE = 'FETCH_AGENTS_FAILURE';
export const SELECT_AGENT = 'SELECT_AGENT';

export const fetchAgentsRequest = () => ({
  type: FETCH_AGENTS_REQUEST,
});

export const fetchAgentsSuccess = (agents) => ({
  type: FETCH_AGENTS_SUCCESS,
  payload: agents,
});

export const fetchAgentsFailure = (error) => ({
  type: FETCH_AGENTS_FAILURE,
  payload: error,
});

export const selectAgent = (agent) => ({
  type: SELECT_AGENT,
  payload: agent,
});
