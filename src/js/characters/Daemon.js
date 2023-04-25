export default class Daemon extends Character {
    constructor(type = 'daemon', health, level, attack = 10, defence = 10) {
        if (level > 4) {
            throw new Error('Максимальный уровень 4!');
        }
        super(type, health, level, attack, defence);
    }
}