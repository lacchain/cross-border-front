const validate = (values) => {
  const errors = {};
  if (!values.username) {
    errors.username = 'Username field shouldn’t be empty';
  }
  if (!values.email) {
    errors.email = 'Email field shouldn’t be empty';
  } else if (!/^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/i.test(values.email)) {
    errors.email = 'Invalid email address';
  }
  if (!values.password) {
    errors.password = 'Password field shouldn’t be empty';
  } else if (values.password.length < 6  || values.password.length > 16) {
    errors.password = 'Password needs to have between 6 and 16 characters';
  }

  return errors;
};

export default validate;