import {  legacy_createStore as createStore, applyMiddleware } from 'redux';
import agentReducer from '../reducers/agentReducer';
import agentApi from '../Api/agentApi';

const store = createStore(
  agentReducer,
  applyMiddleware(agentApi)
);

export default store;