export default class Magician extends Character {
    constructor(type = 'magician', health, level, attack = 10, defence = 40) {
        if (level > 4) {
            throw new Error('Максимальный уровень 4!');
        }
        super(type, health, level, attack, defence);
    }
}