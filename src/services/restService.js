import axios from 'axios';
import jwt from 'jsonwebtoken';
import moment from 'moment';
import { userService } from './userService';
import { authService } from './authService';

const get = (url) => {
  let config = {
    headers: authService.authHeader()
  };
  
  return axios.get(`${process.env.BACKOFFICE_API}${url}`, config)
  .catch((error) => {
    if (!error.response) {
      return;
    }

    if (error.response.status === 403 || error.response.status === 404) {
      return error.response.status;
    }

    if (error.response.status === 401) {
      let user = userService.getUser();

      const token = jwt.decode(user.access_token);
      const expiresAt = moment(token.exp);

      if (moment().isAfter(expiresAt)) {
        authService.logout();
        window.location = '/log_in';
      }
    }
  });
};

const post = (url, body) => {

  let config = {
    headers: authService.authHeader(),
  };

  return axios.post(`${process.env.BACKOFFICE_API}${url}`, body, config)
  .catch((error) => {
    if (!error.response) {
      return;
    }
});
};

const proxyPost = (url, body) => {

  let config = {
    headers: {'Content-Type': 'text/xml'}
  };

  return axios.post(`${process.env.PROXY_API}${url}`, body)
  .catch((error) => {
    if (!error.response) {
      return;
    }
});
};

export default {
  get,
  post,
  proxyPost
};
