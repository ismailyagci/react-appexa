import { toCamelCase } from "../../utils";
import {
  createObject,
  generateCrudActions,
  generateCrudConstants,
  generateCrudState,
} from "./utils";

class CRUD {
  constructor(props) {
    this.items = props.items;
    this.crudTemplate = {
      pending: false,
      data: null,
      error: null,
      initialSuccess: false
    };
    Object.keys(this.constants).forEach((key) => {
      this[toCamelCase(key)] = (data) => ({ type: this.constants[key], data })
    });
    this._state = props.state || {};
    this._constants = props.constants || {}
  };

  get constants() {
    return {
      ...createObject(this.items, generateCrudConstants),
      ...this._constants
    }
  }

  get state() {
    return {
      ...generateCrudState(this.items.map((item) => toCamelCase(item)), this.crudTemplate),
      ...this._constants
    }
  }

  handleAction() {
    const actions = createObject(this.items.map((item) => toCamelCase(item)), (name) => generateCrudActions(name, this.crudTemplate));
    return actions;
  }
};

export default CRUD;