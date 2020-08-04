import store from '../../App/storeConfig';

const validate = (values) => {
  let errors = {};
  if (store.getState().form.wizard) {
    errors = store.getState().form.wizard.syncErrors ? store.getState().form.wizard.syncErrors : {};
  }
  
  if (!values.amount) {
    errors.amount = 'Amount field shouldn’t be empty';
  }

  if (!values.currency) {
    errors.currency = 'Recipient currency field shouldn’t be empty';
  }

  return errors;
};

export default validate;