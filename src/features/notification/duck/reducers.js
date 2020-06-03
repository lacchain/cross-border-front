import types from './types';

const INITIAL_STATE = {
  error: {},
  success: {},
};

const notificationReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case types.SET_SUCCESS_NOTIFICATION: {
      return {
        ...state,
        success: {
          title: action.title,
          message: action.message,
        }
      };
    }

    case types.SET_ERROR_NOTIFICATION: {
      return {
        ...state,
        error: {
          title: action.title,
          message: action.message,
        }
      };
    }
    case types.DELETE_SUCCESS_NOTIFICATION: {
      return {
        ...state,
        success: {}
      };
    }

    case types.DELETE_ERROR_NOTIFICATION: {
      return {
        ...state,
        error: {}
      };
    }

    default:
      return state;
  }
};

export default notificationReducer;
