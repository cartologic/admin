import {
  isTokenExpired, isInternationalEditor, isNationalEditor, isInternationalReviewer, isNationalReviewer,
  isAdmin, isEditor, isIndicatorEditor, isIndicatorReviewer, sub, isReviewer
} from './jwtHelper';

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
    return !!token && !isTokenExpired(token) && (isEditor(token) || isReviewer(token) || isAdmin(token));
  }

  loggedInNotEditor () {
    const token = this.getToken();
    return !!token && !isTokenExpired(token) && !(isEditor(token) || isReviewer(token) || isAdmin(token));
  }

  isAdmin () {
    const token = this.getToken();
    return isAdmin(token);
  }
  isNationalEditor () {
    const token = this.getToken();
    return isNationalEditor(token);
  }
  isInternationalEditor () {
    const token = this.getToken();
    return isInternationalEditor(token);
  }
  isIndicatorEditor () {
    const token = this.getToken();
    return isIndicatorEditor(token);
  }
  isNationalReviewer () {
    const token = this.getToken();
    return isNationalReviewer(token);
  }
  isInternationalReviewer () {
    const token = this.getToken();
    return isInternationalReviewer(token);
  }
  isIndicatorReviewer () {
    const token = this.getToken();
    return isIndicatorReviewer(token);
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
