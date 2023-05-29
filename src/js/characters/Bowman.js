import Character from '../Character';

export default class Bowman extends Character {
  constructor(level) {
    super(level, 'bowman');
    this.attack = 25;
    this.defence = 25;
    this.move = 2;
    this.attackDistance = 2;

    if (level > 4) {
      throw new Error('Максимальный уровень 4!');
    }
  }
}
