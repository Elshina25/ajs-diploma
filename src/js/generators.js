// import Daemon from '/characters/Daemon';
// import Magician from '/characters/Magician';
// import Vampire from '/characters/Vampire';
// import Bowman from '/characters/Bowman';
// import Swordsman from '/characters/Swordsman';
// import Undead from '/characters/Undead';
// import Character from 'Character';
import Team from './Team';

/**
 * Формирует экземпляр персонажа из массива allowedTypes со
 * случайным уровнем от 1 до maxLevel
 *
 * @param allowedTypes массив классов
 * @param maxLevel максимальный возможный уровень персонажа
 * @returns генератор, который при каждом вызове
 * возвращает новый экземпляр класса персонажа
 *
 */
export function* characterGenerator(allowedTypes, maxLevel) {
  if (maxLevel > 4) {
    throw new Error('Максимальный уровень 4!');
  } 
  const randomPers = Math.floor(Math.random() * allowedTypes.length);
  const randomLevel = Math.floor(Math.random() * (maxLevel - 1) + 1);

  yield new allowedTypes[randomPers](randomLevel);

}

/**
 * Формирует массив персонажей на основе characterGenerator
 * @param allowedTypes массив классов
 * @param maxLevel максимальный возможный уровень персонажа
 * @param characterCount количество персонажей, которое нужно сформировать
 * @returns экземпляр Team, хранящий экземпляры персонажей. Количество персонажей в команде - characterCount
 * */
export function* generateTeam(allowedTypes, maxLevel, characterCount) {
  if (maxLevel > 4) {
    throw new Error('Максимальный уровень 4!');
  } 
  
  const characters = [];

  let i = 1;
  while (i <= characterCount) {
    characters.push(characterGenerator(allowedTypes, maxLevel).next().value);
    i += 1;
  }
  return new Team(characters)
}
