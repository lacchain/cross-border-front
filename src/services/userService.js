export const userService = {
  getUser,
  isCiti
};

function getUser() {
  let user = localStorage.getItem('user');

  return user;
}

function isCiti() {
  let role = JSON.parse(localStorage.getItem('role'));

  return role === "ROLE_CITI";
}
