import { calcTileType } from '../utils';

test('drawning border at gameplay', () => {
    const result = calcTileType(0, 8);
    expect(result).toEqual('top-left');
})