import Character from '../Character';

export default class Swordsman extends Character {
  constructor(level, type = 'swordsman', health = 50, attack = 40, defence = 10) {
    super(type, health, level, attack, defence);
    this.attack = attack;
    this.defence = defence;
    this.type = type;
    this.health = health;
    this.level = level;
    this.move = 4;
    this.attackDistance = 1;

    if (level > 4) {
      throw new Error('Максимальный уровень 4!');
    }
  }
}