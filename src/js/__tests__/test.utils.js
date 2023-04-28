import { calcTileType } from '../utils';

test('drawning top-left border at gameplay', () => {
  const result = calcTileType(0, 8);
  expect(result).toEqual('top-left');
});

test('drawning top border at gameplay', () => {
  const result = calcTileType(3, 8);
  expect(result).toEqual('top');
});

test('drawning top-right border at gameplay', () => {
  const result = calcTileType(7, 8);
  expect(result).toEqual('top-right');
});

test('drawning left border at gameplay', () => {
  const result = calcTileType(32, 8);
  expect(result).toEqual('left');
});

test('drawning right border at gameplay', () => {
  const result = calcTileType(39, 8);
  expect(result).toEqual('right');
});

test('drawning bottom-left border at gameplay', () => {
  const result = calcTileType(56, 8);
  expect(result).toEqual('bottom-left');
});

test('drawning bottom-right border at gameplay', () => {
  const result = calcTileType(63, 8);
  expect(result).toEqual('bottom-right');
});

test('drawning bottom border at gameplay', () => {
  const result = calcTileType(60, 8);
  expect(result).toEqual('bottom');
});

test('drawning center border at gameplay', () => {
  const result = calcTileType(35, 8);
  expect(result).toEqual('center');
});

