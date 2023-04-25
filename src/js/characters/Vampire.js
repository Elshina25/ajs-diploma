export default class Vampire extends Character {
    constructor(type = 'vampire', health, level, attack = 25, defence = 25) {
        if (level > 4) {
            throw new Error('Максимальный уровень 4!');
        }
        super(type, health, level, attack, defence);
    }
}