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
    this.health = 50;
    this.level = level;
    this.type = type;
    this.attack = 0;
    this.defence = 0;

    if (new.target === Character) {
      throw new Error('Персонажи создаются через свои классы!');
    }
  }

  levelUp() {
    const healthBefore = this.health;
    this.level += 1;
    this.health += 80;
    this.attack = Math.max(this.attack, this.attack * (80 + healthBefore) / 100);
    this.defence = Math.max(this.defence, this.defence * (80 + healthBefore) / 100);
      
    if (this.health > 100) {
      this.health = 100;
    }
  }
}
