class Container {
  constructor() {
    this.state = new Map();
    this.listeners = [];
  };

  notifyListeners(key, value) {
    this.listeners.forEach((listener) => listener(key, value))
  };

  set(key, value) {
    this.notifyListeners(key, value)
    this.state[key] = value
  };

  get(key) {
    return this.state[key];
  };

  onChange(callback) {
    this.listeners.push(callback);
  }
};

export default new Container();