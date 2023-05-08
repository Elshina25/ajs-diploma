import GameController from "./GameController";
export default class GameState {
  constructor() {
    this.userTurn = true;
    this.level = 1;
    this.points = 0;
    this.statistics = [];
    this.selected = null;
  }
  static from(object) {

    return null;
  }
}
