export default class Swordsman extends Character {
    constructor(type = 'swordsman', health, level, attack = 40, defence = 10) {
        if (level > 4) {
            throw new Error('Максимальный уровень 4!');
        }
        super(type, health, level, attack, defence);
    }
}