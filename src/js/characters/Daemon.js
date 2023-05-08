import Character from '../Character';

export default class Daemon extends Character {
  constructor(level, type = 'daemon', health = 50, attack = 10, defence = 10) {
    super(type, health, level, attack, defence);
    this.attack = attack;
    this.defence = defence;
    this.type = type;
    this.health = health;
    this.level = level;
    this.move = 1;
    this.attackDistance = 4;

    if (level > 4) {
      throw new Error('Максимальный уровень 4!');
    }
  }
}
