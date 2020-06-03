import { applyMiddleware, createStore, combineReducers } from 'redux';
import web3Reducer from '../../features/web3/duck/reducers';
import notificationReducer from '../../features/notification/duck/reducers';
import { reducer as reduxFormReducer } from 'redux-form';
import { save, load } from 'redux-localstorage-simple';
import logger from 'redux-logger';

const rootReducer = combineReducers({
  form: reduxFormReducer,
  web3: web3Reducer,
  notification: notificationReducer
});

const middlewares = [];
middlewares.push(save());
middlewares.push(logger);

const createStoreWithMiddleware = applyMiddleware(...middlewares)(createStore);

export default createStoreWithMiddleware(
  rootReducer,    
  load()
);
