/**
 * Базовый класс, от которого наследуются классы персонажей
 * @property level - уровень персонажа, от 1 до 4
 * @property attack - показатель атаки
 * @property defence - показатель защиты
 * @property health - здоровье персонажа
 * @property type - строка с одним из допустимых значений:
 * swordsman
 * bowman
 * magician
 * daemon
 * undead
 * vampire
 */
export default class Character {
  constructor(level, type = 'generic') {
    this.level = level;
    this.health = 50;
    this.attack = 0;
    this.defence = 0;
    this.type = type;

    if (new.target === Character) {
      throw new Error('Персонажи создаются только через свои классы!');
    }
  }

  levelUp() {
    const healthBefore = this.health;
    this.level += 1;
    this.attack = Math.round(Math.max(this.attack, (this.attack * (80 + healthBefore)) / 100));
    this.defence = Math.round(Math.max(this.defence, (this.defence * (80 + healthBefore)) / 100));

    this.health += 80;
    if (this.health > 100) {
      this.health = 100;
    }
  }
}
