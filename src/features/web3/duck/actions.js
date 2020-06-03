import types from './types';

const setError = (error) => ({
  type: types.SET_ERROR,
  error
});

const setSuccess = (success) => ({
  type: types.SET_SUCCESS,
  success
});

export default {
  setError,
  setSuccess,
};
