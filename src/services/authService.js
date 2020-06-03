import axios from 'axios';
import qs from 'qs';
export const authService = {
    logout,
    authHeader,
    signUp,
    getToken
};

function authHeader() {
  let access_token = JSON.parse(localStorage.getItem('access_token'));

    if (access_token) {
        return {
            'Authorization': 'Bearer ' + access_token,
            'Content-Type': 'application/json'
        };
    } else {
        return {};
    }
}

function getToken(username, password, dltAddress) {
  const data = qs.stringify({
    grant_type: "password",
    scope: "write",
    username: username,
    password: password
  });
  return axios.request({
    url: `${process.env.BACKOFFICE_API}/oauth/token`,
    method: "POST",
    headers: { 
      "Content-Type": "application/x-www-form-urlencoded",
      "dlt-address": dltAddress
    },
    auth: {
      username: 'web-react',
      password: 'web123'
    },
    data
  }).then(function(response) {
    if (response.data) {
      console.log('login', response.data)
      localStorage.setItem('access_token', JSON.stringify(response.data.access_token));
      localStorage.setItem('role', JSON.stringify(response.data.authorities[0].authority));
      localStorage.setItem('user', JSON.stringify(username));
    }
  });
}

function signUp(body) {
    return axios.post(`${process.env.BACKOFFICE_API}/api/user`, {
        accountDetails: {
            company: body.company,
            fullname: body.fullName,
            email: body.email,
            password: body.password,
            dltAddress: body.dltAddress
        },
        bankDetails: {
            bankName: 'bankito',
            bankTaxId: body.bankTaxId,
            bankCity: body.bankCity,
            bankAccount: body.bankAccount
        }
    }).then(response => {
        if (response.status === 201) {
            localStorage.setItem('user', body.email);
            return response.data;
        }
    });
}

function logout() {
    // remove user from local storage to log user out
    localStorage.removeItem('user');
    localStorage.removeItem('role');
}