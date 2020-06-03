import types from './types';

const setSuccessNotification = (title, message) => ({
  type: types.SET_SUCCESS_NOTIFICATION,
  title,
  message,
});

const setErrorNotification = (title, message) => ({
  type: types.SET_ERROR_NOTIFICATION,
  title,
  message,
});

const deleteSuccessNotification = () => ({
  type: types.DELETE_SUCCESS_NOTIFICATION,
});

const deleteErrorNotification = () => ({
  type: types.DELETE_ERROR_NOTIFICATION,
});

export default {
  setSuccessNotification,
  setErrorNotification,
  deleteSuccessNotification,
  deleteErrorNotification,
};
