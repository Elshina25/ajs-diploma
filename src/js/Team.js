/**
 * Класс, представляющий персонажей команды
 *
 * @todo Самостоятельно продумайте хранение персонажей в классе
 * Например
 * @example
 * ```js
 * const characters = [new Swordsman(2), new Bowman(1)]
 * const team = new Team(characters);
 *
 * team.characters // [swordsman, bowman]
 * ```
 * */
export default class Team {
  constructor() {
    this.team = new Set();
  }

  * [Symbol.iterator]() {
    for (const character of this.team) {
      yield character;
    }
  }

  add(member) {
    if (this.team.has(member)) {
      throw new Error('Такой персонаж уже есть в команде!');
    }
    return this.team.add(member);
  }

  addAll(characters) {
    this.team = new Set([...this.team, ...characters]);
  }

  delete(member) {
    this.team.delete(member);
  }
}
