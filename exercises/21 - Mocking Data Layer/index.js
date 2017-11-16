import eventApi from './eventApi';

export const getEvent = (id) => {
  // hacktastic cacheing
  if (!getEvent.memo) {
    getEvent.memo = {};
  }

  if (getEvent.memo[id]) {
    return getEvent.memo[id];
  }

  const event = eventApi.get(id);
  getEvent.memo[id] = event;
  return event;
} 