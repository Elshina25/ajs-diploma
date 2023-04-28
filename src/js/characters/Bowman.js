import Character from '../Character';
export default class Bowman extends Character {
    constructor(level, type = 'bowman', health = 50, attack = 25, defence = 25) {
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