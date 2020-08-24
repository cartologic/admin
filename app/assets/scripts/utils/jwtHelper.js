import decode from 'jwt-decode';

export function getTokenExpirationDate (token) {
  const decoded = decode(token);

  if (!decoded.exp) {
    return null;
  }

  const date = new Date(0);
  date.setUTCSeconds(decoded.exp);

  return date;
}

export function isTokenExpired (token) {
  const date = getTokenExpirationDate(token);
  const offsetSeconds = 0;
  if (date === null) {
    return false;
  }

  return !(date.valueOf() > (new Date().valueOf() + (offsetSeconds * 1000)));
}

export function isEditor (token) {
  const decoded = decode(token);
  return decoded.roles && decoded.roles.indexOf('edit') > -1;
}

export function isInternationalEditor (token) {
  const decoded = decode(token);
  return decoded.roles && decoded.roles.indexOf('international editor') > -1;
}
export function isDomesticEditor (token) {
  const decoded = decode(token);
  return decoded.roles && decoded.roles.indexOf('domestic editor') > -1;
}

export function isAdmin (token) {
  const decoded = decode(token);
  return decoded.roles && decoded.roles.indexOf('admin') > -1;
}

export function sub (token) {
  const decoded = decode(token);
  return decoded.sub;
}

