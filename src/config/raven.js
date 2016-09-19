import Raven from 'raven-js';

// Raven.config('https://74b98d69b05c4a958c4c247eecaf74a4@172.17.31.73:9000/2').install();

export function setUserContext(user) {
  Raven.setUserContext(user);
}

export function resetUserContext() {
  Raven.setUserContext();
}

export function config() {
  Raven.config().install();
}
