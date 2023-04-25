/**
 * @todo
 * @param index - индекс поля
 * @param boardSize - размер квадратного поля (в длину или ширину)
 * @returns строка - тип ячейки на поле:
 *
 * top-left
 * top-right
 * top
 * bottom-left
 * bottom-right
 * bottom
 * right
 * left
 * center
 *
 * @example
 * ```js
 * calcTileType(0, 8); // 'top-left'
 * calcTileType(1, 8); // 'top'
 * calcTileType(63, 8); // 'bottom-right'
 * calcTileType(7, 7); // 'left'
 * ```
 * */
export function calcTileType(index, boardSize) {
  if (index === 0) {
    return 'top-left';
  } else if (index === 7) {
    return 'top-right';
  } else if (index >= 1 && index <=6) {
    return 'top';
  } else if (index === 56) {
    return 'bottom-left';
  } else if (index === 63) {
    return 'bottom-right';
  } else if (index >=57 && index <= 62) {
    return 'bottom';
  } else if (index % 8 === 0) {
    return 'left';
  } else if (index % 8 === 7) {
    return 'right';
  }
  return 'center';
}

export function calcHealthLevel(health) {
  if (health < 15) {
    return 'critical';
  }

  if (health < 50) {
    return 'normal';
  }

  return 'high';
}
