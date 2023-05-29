import Character from '../Character';

export default class Vampire extends Character {
  constructor(level) {
    super(level, 'vampire');
    this.attack = 25;
    this.defence = 25;
    this.move = 2;
    this.attackDistance = 2;

    if (level > 4) {
      throw new Error('Максимальный уровень 4!');
    }
  }
}
