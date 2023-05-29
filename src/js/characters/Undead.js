import Character from '../Character';

export default class Undead extends Character {
  constructor(level) {
    super(level, 'undead');
    this.attack = 40;
    this.defence = 10;
    this.move = 4;
    this.attackDistance = 1;

    if (level > 4) {
      throw new Error('Максимальный уровень 4!');
    }
  }
}
