import types from './types';

const INITIAL_STATE = {
  error: null,
  success: null,
};

const web3Reducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case types.SET_ERROR: {
      return {
        ...state,
        error: action.error
      };
    }
    
    case types.SET_SUCCESS: {
      return {
        ...state,
        success: action.success
      };
    }

    default:
      return state;
  }
};

export default web3Reducer;
