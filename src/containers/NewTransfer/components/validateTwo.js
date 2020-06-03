const validate = (values) => {
  const errors = {};
  if (!values.recipientBankAccount) {
    errors.recipientBankAccount = 'Recipient bank account field shouldn’t be empty';
  }

  if (!values.recipientDltAddress) {
    errors.recipientDltAddress = 'Recipient DLT address field shouldn’t be empty';
  }
  return errors;
};

export default validate;