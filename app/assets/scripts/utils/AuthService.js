import { isTokenExpired, isInternationalEditor, isDomesticEditor, isAdmin, sub } from './jwtHelper';

import reqwest from 'reqwest';
import auth0 from 'auth0-js';

export default class AuthService {
  constructor (clientID, domain) {
    this.auth0 = new auth0.WebAuth({ clientID, domain, responseType: 'token id_token' });

    this.login = this.login.bind(this);
    this.signup = this.signup.bind(this);
  }

  request (url, method, options) {
    let headers = {};
    if (this.loggedIn()) {
      headers['Authorization'] = this.getToken();
    }

    let reqParams = Object.assign({}, {
      url,
      method,
      headers,
      type: 'json',
      contentType: 'application/json'
    }, options || {});

    return reqwest(reqParams);
  }

  login (params, onError) {
    this.auth0.login(params, onError);
  }

  signup (params, onError) {
    this.auth0.signup(params, onError);
  }

  parseHash (hash, replace, callback) {
    this.auth0.parseHash({hash}, (err, authResult) => {
      if (err) console.log(err);
      if (authResult && authResult.idToken) {
        this.setToken(authResult.idToken);
      }
      replace({ pathname: '/' });
      callback();
    });
  }

  loggedIn () {
    const token = this.getToken();
    return !!token && !isTokenExpired(token) && (isInternationalEditor(token) || isDomesticEditor(token));
  }

  loggedInNotEditor () {
    const token = this.getToken();
    return !!token && !isTokenExpired(token) && !((isInternationalEditor(token) || isDomesticEditor(token)) || isAdmin(token));
  }

  isAdmin () {
    const token = this.getToken();
    return isAdmin(token);
  }
  isDomesticEditor () {
    const token = this.getToken();
    return isDomesticEditor(token);
  }
  isInternationalEditor () {
    const token = this.getToken();
    return isInternationalEditor(token);
  }

  getSub () {
    const token = this.getToken();
    return sub(token);
  }

  setToken (idToken) {
    localStorage.setItem('id_token', idToken);
  }

  getToken () {
    return localStorage.getItem('id_token');
  }

  logout () {
    localStorage.removeItem('id_token');
  }
}
