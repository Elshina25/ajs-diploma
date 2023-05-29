import Daemon from '../characters/Daemon';
import Bowman from '../characters/Bowman';
import Character from '../Character';
import Magician from '../characters/Magician';
import Swordsman from '../characters/Swordsman';
import Undead from '../characters/Undead';
import Vampire from '../characters/Vampire';
import { characterGenerator, generateTeam } from '../generators';

test.each([
  [new Bowman(1)],
  [new Daemon(1)],
  [new Magician(1)],
  [new Swordsman(1)],
  [new Undead(1)],
  [new Vampire(1)],
])(('Correct characters creation'), (pers) => {
  expect(() => pers).not.toThrow();
});

test('error new Character', () => {
  expect(() => new Character(3, 'daemon')).toThrow('Персонажи создаются только через свои классы!');
});

test('infinity generator characters', () => {
  const arr = [Daemon, Bowman, Magician];
  const func = characterGenerator(arr, 2);
  expect(func.next().done).toEqual(false);
});

test('error maxlevel', () => {
  expect(() => {
    const arr = [Daemon, Bowman, Magician];
    const func = characterGenerator(arr, 5);
    return func.next().value;
  }).toThrow('Максимальный уровень 4!');
});

test('correct maxlevel', () => {
  const team = generateTeam([Daemon, Bowman, Magician], 3, 3);
  const maxlevel = team.every((item) => item.level <= 3);
  expect(maxlevel).toBeTruthy();
});

test('team quantity', () => {
  const team = generateTeam([Bowman, Swordsman, Magician], 3, 3);
  expect(team.length).toEqual(3);
});
