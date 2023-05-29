import Bowman from '../characters/Bowman';

test('show correct tooltip about characters features', () => {
  const bowman = new Bowman(2);
  const tooltip1 = `${String.fromCodePoint(0x1F396)}:${bowman.level}${String.fromCodePoint(0x2694)}:${bowman.attack}${String.fromCodePoint(0x1F6E1)}:${bowman.defence}${String.fromCodePoint(0x2764)}:${bowman.health}`;
  const tooltip2 = '\u{1F396}:2\u{2694}:25\u{1F6E1}:25\u{2764}:50';
  expect(tooltip1).toEqual(tooltip2);
});
