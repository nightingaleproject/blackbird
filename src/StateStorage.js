// Allow state for individual components to be stored in local browser storage
const StateStorage = {

  retrieveState(stateKey, defaultState) {
    const localState = localStorage[stateKey];
    if (localState) {
      return Object.assign({}, defaultState, JSON.parse(localState));
    } else {
      return defaultState;
    }
  },

  storeState(stateKey, state) {
    localStorage[stateKey] = JSON.stringify(state);
  }

}

export default StateStorage;
