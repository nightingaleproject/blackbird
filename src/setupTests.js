import { configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

// Solution from https://stackoverflow.com/questions/32911630/how-do-i-deal-with-localstorage-in-jest-tests
class LocalStorageStub {
  constructor() {
    this.store = {};
  }
  clear() {
    this.store = {};
  }
  getItem(key) {
    return this.store[key] || null;
  }
  setItem(key, value) {
    this.store[key] = value.toString();
  }
  removeItem(key) {
    delete this.store[key];
  }
};

global.localStorage = new LocalStorageStub;

configure({ adapter: new Adapter() });
