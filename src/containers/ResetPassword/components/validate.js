const validate = (values) => {
  const errors = {};

  if (!values.newPassword) {
    errors.newPassword = 'Password field shouldn’t be empty';
  }
  if (!values.confirmNewPassword) {
    errors.confirmNewPassword = 'Confirm Password field shouldn’t be empty';
  }  else if (values.confirmNewPassword && values.newPassword != values.confirmNewPassword) {
    errors.confirmNewPassword = 'Passwords must match';
  }

  return errors;
};

export default validate;