export default class GameState {
  constructor() {
    this.userTurn = true;
    this.points = 0;
    this.statistics = [];
    this.selected = null;
  }

  static from(object) {
    if (typeof object === 'object') {
      return object;
    }
    return null;
  }
}
