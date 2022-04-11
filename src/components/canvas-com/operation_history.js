


export default class OperationHistory {
  constructor() {
    this.queue = [];
    this.length = 1000;
    this.bottom = 0;
    this.top = 0;
    this.current = 0;
    this.empty = true;

    // At the Begin of Queue
    this.BOQ = true;

    // At the End of Queue
    this.EOQ = true;

    // 0: set, 1: prev, 2: next
    this._action = 0;
    this._round = 0;
  }

  set(item) {

    console.log("=== Editing.set");

    var result = null;

    if (this._action != 0) {
      this.top = this.current + 1;
    }

    if (this.top >= this.length) {
      result = this.queue.shift();
      this.top = this.length - 1;
    }

    this._action = 0;
    this.queue[this.top] = item;
    this.current = this.top;
    this.top++;

    this.empty = false;
    this.EOQ = true;
    this.BOQ = false;

    return result;

  }

  /**
   * To fetch the previous item just before current one
   *
   * @returns {item|boolean}
   */
  prev() {

    console.log("=== Editing.prev");

    if (this.empty) {
      return false;
    }

    if (this.BOQ) {
      return false;
    }

    this._action = 1;

    this.current--;

    if (this.current == this.bottom) {
      this.BOQ = true;
    }

    var item = this.queue[this.current];
    this.EOQ = false;
    return item;
  }

  /**
   * To fetch the next item just after the current one
   *
   * @returns {*|boolean}
   */
  next() {

    console.log("=== Editing.next");

    if (this.empty) {
      return false;
    }

    if (this.EOQ) {
      return false;
    }

    this.current++;

    if (this.current == this.top - 1 && this.top < this.length) {
      this.EOQ = true;
    }

    if (this.current == this.top - 1 && this.top == this.length) {
      this.EOQ = true;
    }

    this._action = 2;

    var item = this.queue[this.current];
    this.BOQ = false;
    return item;
  }


  /**
   * To empty the editing and reset all state
   */
  clear() {

    this.queue = [];
    this.bottom = 0;
    this.top = 0;
    this.current = 0;
    this.empty = true;
    this.BOQ = true;
    this.EOQ = false;
  }


}