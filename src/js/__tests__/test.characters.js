import Daemon from '../characters/Daemon';
import Bowman from '../characters/Bowman';
import Character from '../Character';
import Magician from '../characters/Magician';
import Swordsman from '../characters/Swordsman';
import Undead from '../characters/Undead';
import Vampire from '../characters/Vampire';
import { characterGenerator } from '../generators';
import { generateTeam } from '../generators';
import Team from '../Team';


test.each([
    [new Bowman(1)],
    [new Daemon(1)],
    [new Magician(1)],
    [new Swordsman(1)],
    [new Undead(1)],
    [new Vampire(1)],
    ])(('Корректное создание персонажей'), (char) => {
    expect(() => char).not.toThrow();
    });

test('error new Character', () => {
  expect(() => {
    const char = new Character(3, 'daemon');
  }).toThrow('Персонажи создаются через свои классы!');
})

test('infinity generator characters', () => {
    const arr = [Daemon, Bowman, Magician];
    const func = characterGenerator(arr, 2);
    expect(func.next().done).toBeFalsy;
});

test('error maxlevel', () => {
  expect(() => {
    const arr = [Daemon, Bowman, Magician];
    const func = characterGenerator(arr, 5);
    func.next().value;
  }).toThrow('Максимальный уровень 4!');
});

// test('create team', () => {
//   const arr = [Bowman, Swordsman, Magician];
//   const func = generateTeam(arr, 3, 3);
//   expect(func.next().value).toEqual([Bowman, Swordsman, Magician])
// });

test('team quantity', () => {
  const team = generateTeam([Bowman, Swordsman, Magician], 3, 3).next().value;
  expect(team.length).toEqual(3);
})