const validate = (values) => {
  const errors = {};
  if (!values.amount) {
    errors.amount = 'Amount field shouldn’t be empty';
  }

  if (!values.currency) {
    errors.currency = 'Recipient currency field shouldn’t be empty';
  }

  return errors;
};

export default validate;