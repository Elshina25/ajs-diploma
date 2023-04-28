import Character from '../Character';
export default class Undead extends Character {
    constructor(level, type = 'undead', health = 50, attack = 40, defence = 10) {
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