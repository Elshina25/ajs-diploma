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
  
  for (let i = 1; i <= characterCount; i += 1) {
    characters.push(characterGenerator(allowedTypes, maxLevel).next().value);
  }
  return characters
}

export function* generateRandomPosition(positions) {
  let currentIndex = positions.length;
  let temporaryValue;
  let randomIndex;

  const shuffledArray = positions.slice();
  while (currentIndex !== 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;
    temporaryValue = shuffledArray[currentIndex];
    shuffledArray[currentIndex] = shuffledArray[randomIndex];
    shuffledArray[randomIndex] = temporaryValue;
  }
  for (let i = 0; i < shuffledArray.length; i += 1) {
    yield shuffledArray[i];
  }
}

