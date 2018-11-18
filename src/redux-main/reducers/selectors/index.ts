export const getStateDataByKey = (state) => (stateKey) => state[stateKey];

export const getUserNotificationsState = (state) => (
  getStateDataByKey(state)('userNotifications')
);
