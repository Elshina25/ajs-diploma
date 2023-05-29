import GameController from '../GameController';
import GamePlay from '../GamePlay';
import GameStateService from '../GameStateService';
import Daemon from '../characters/Daemon';
import Bowman from '../characters/Bowman';
import Magician from '../characters/Magician';
import Swordsman from '../characters/Swordsman';
import Undead from '../characters/Undead';
import Vampire from '../characters/Vampire';

const localStorage = require('node-localstorage').LocalStorage;

const gameController = new GameController(new GamePlay(), new GameStateService(localStorage));

test('move distance for Bowman', () => {
  const bowman = new Bowman(2);
  const distance = bowman.move;
  const allowedMove = [40, 24, 48, 16, 33, 25, 41, 34, 18, 50];
  expect(gameController.calcMoveAttack(32, distance)).toEqual(allowedMove);
});

test('attack distance for Bowman', () => {
  const bowman = new Bowman(2);
  const attack = bowman.attackDistance;
  const allowedMove = [40, 24, 48, 16, 33, 25, 41, 34, 18, 50];
  expect(gameController.calcMoveAttack(32, attack)).toEqual(allowedMove);
});

test('move distance for Magician', () => {
  const magician = new Magician(2);
  const distance = magician.move;
  const allowedMove = [40, 24, 33, 25, 41];
  expect(gameController.calcMoveAttack(32, distance)).toEqual(allowedMove);
});

test('attack distance for Magician', () => {
  const magician = new Magician(2);
  const attack = magician.attackDistance;
  const allowedMove = [40, 24, 48, 16, 56, 8, 0, 33, 25, 41, 34, 18, 50, 35, 11, 59, 36, 4];
  expect(gameController.calcMoveAttack(32, attack)).toEqual(allowedMove);
});

test('move distance for Swordsman', () => {
  const swordsman = new Swordsman(2);
  const distance = swordsman.move;
  const allowedMove = [40, 24, 48, 16, 56, 8, 0, 33, 25, 41, 34, 18, 50, 35, 11, 59, 36, 4];
  expect(gameController.calcMoveAttack(32, distance)).toEqual(allowedMove);
});

test('attack distance for Swordsman', () => {
  const swordsman = new Swordsman(2);
  const attack = swordsman.attackDistance;
  const allowedMove = [40, 24, 33, 25, 41];
  expect(gameController.calcMoveAttack(32, attack)).toEqual(allowedMove);
});

test('move distance for Undead', () => {
  const undead = new Undead(2);
  const distance = undead.move;
  const allowedMove = [47, 31, 55, 23, 63, 15, 7, 38, 30, 46, 37, 21, 53, 36, 12, 60, 35, 3];
  expect(gameController.calcMoveAttack(39, distance)).toEqual(allowedMove);
});

test('move attack for Undead', () => {
  const undead = new Undead(2);
  const attack = undead.attackDistance;
  const allowedMove = [47, 31, 38, 30, 46];
  expect(gameController.calcMoveAttack(39, attack)).toEqual(allowedMove);
});

test('move distance for Daemon', () => {
  const daemon = new Daemon(2);
  const distance = daemon.move;
  const allowedMove = [47, 31, 38, 30, 46];
  expect(gameController.calcMoveAttack(39, distance)).toEqual(allowedMove);
});

test('attack distance for Daemon', () => {
  const daemon = new Daemon(2);
  const attack = daemon.attackDistance;
  const allowedMove = [47, 31, 55, 23, 63, 15, 7, 38, 30, 46, 37, 21, 53, 36, 12, 60, 35, 3];
  expect(gameController.calcMoveAttack(39, attack)).toEqual(allowedMove);
});

test('move distance for Vampire', () => {
  const vampire = new Vampire(2);
  const distance = vampire.move;
  const allowedMove = [47, 31, 55, 23, 38, 30, 46, 37, 21, 53];
  expect(gameController.calcMoveAttack(39, distance)).toEqual(allowedMove);
});

test('attack distance for Vampire', () => {
  const vampire = new Vampire(2);
  const attack = vampire.move;
  const allowedMove = [47, 31, 55, 23, 38, 30, 46, 37, 21, 53];
  expect(gameController.calcMoveAttack(39, attack)).toEqual(allowedMove);
});
