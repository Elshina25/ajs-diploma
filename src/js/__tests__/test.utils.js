import { calcTileType, calcHealthLevel } from '../utils';

test.each([
  [0, 8, 'top-left'],
  [3, 8, 'top'],
  [7, 8, 'top-right'],
  [32, 8, 'left'],
  [35, 8, 'center'],
  [39, 8, 'right'],
  [56, 8, 'bottom-left'],
  [60, 8, 'bottom'],
  [63, 8, 'bottom-right'],
])(
  ('calcTileType return value belongs to index'),
  (index, boardSize, value) => {
    expect(calcTileType(index, boardSize)).toBe(value);
  },
);

test.each([
  [13, 'critical'],
  [45, 'normal'],
  [70, 'high'],
])(('calcHealthLevel return value belongs to health level'), (health, value) => {
  expect(calcHealthLevel(health)).toBe(value);
});
