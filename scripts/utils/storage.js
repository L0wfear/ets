const USER = 'user';

export function setItem(key, value) {
  window.localStorage.setItem(key, JSON.stringify(value));
}

export function setSettings(key, value) {
  const settings = getSettings();
  settings[key] = value;
  setItem(USER, settings);
}

export function getSettings() {
  return JSON.parse(window.localStorage.getItem(USER));
}
