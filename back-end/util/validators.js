module.exports.validateRegisterInput = (
  username,
  email,
  password,
  confirmPassword
) => {
  let error = '';
  if (username.trim() === '') {
    error = 'Username must not be empty';
    return checkValid(false, error);
  }
  if (email.trim() === '') {
    error = 'Email must not be empty';
    return checkValid(false, error);
  } else {
    const regEx = /^([0-9a-zA-Z]([-.\w]*[0-9a-zA-Z])*@([0-9a-zA-Z][-\w]*[0-9a-zA-Z]\.)+[a-zA-Z]{2,9})$/;
    if (!email.match(regEx)) {
      error = 'Email must be a valid email address';
      return checkValid(false, error);
    }
  }
  if (password === '') {
    error = 'Password must not empty';
    return checkValid(false, error);
  } else if (password.length < 6) {
    error = 'Passwords must have at least 6 character';
    return checkValid(false, error);
  } else if (password !== confirmPassword) {
    error = 'Passwords must match';
    return checkValid(false, error);
  }

  return checkValid(true, error);
};

module.exports.validateLoginInput = (username, password) => {
  let error = '';
  if (username.trim() === '') {
    error = 'Username must not be empty';
    return checkValid(false, error);
  }
  if (password.trim() === '') {
    error = 'Password must not be empty';
    return checkValid(false, error);
  }

  return checkValid(true, error);
};

function checkValid(check, error) {
  return valid = check ? { error, valid: true } : { error, valid: false }
}