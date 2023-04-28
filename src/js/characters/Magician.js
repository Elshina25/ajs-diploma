import Character from '../Character';
export default class Magician extends Character {
    constructor(level, type = 'magician', health = 50, attack = 10, defence = 40) {
        super(type, health, level, attack, defence);
        this.attack = attack;
        this.defence = defence;
        this.type = type;
        this.health = health;
        this.level = level;

        if (level > 4) {
            throw new Error('Максимальный уровень 4!');
        }
        
    }
}