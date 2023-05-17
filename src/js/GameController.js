import GamePlay from './GamePlay';
import themes from './themes';
import PositionedCharacter from './PositionedCharacter';
import Daemon from './characters/Daemon';
import Magician from './characters/Magician';
import Vampire from './characters/Vampire';
import Bowman from './characters/Bowman';
import Swordsman from './characters/Swordsman';
import Undead from './characters/Undead';
// import Character from './Character';
// import Team from './Team';
import { generateTeam } from './generators';
import GameState from './GameState';

export default class GameController {
  constructor(gamePlay, stateService) {
    this.gamePlay = gamePlay;
    this.stateService = stateService;
    this.boardSize = gamePlay.boardSize;
    this.userCharacters = [Bowman, Swordsman, Magician];
    this.botCharacters = [Daemon, Vampire, Undead];
    this.userTeam = [];
    this.botTeam = [];
    this.level = 1;
    this.gameState = new GameState();
  }

  init() {
    this.gamePlay.drawUi(themes(this.level));
    if (this.level === 2) {
      this.gamePlay.drawUi(themes(2));
    } if (this.level === 3) {
      this.gamePlay.drawUi(themes(3));
    } if (this.level === 4) {
      this.gamePlay.drawUi(themes(4));
    }

    const playerTeam = generateTeam(this.userCharacters, this.level, 3).next().value;
    const enemyTeam = generateTeam(this.botCharacters, this.level, 3).next().value;
    const playerPosition = [0, 1, 8, 9, 16, 17, 24, 25, 32, 33, 40, 41, 48, 49, 56, 57];
    const enemyPosition = [6, 7, 14, 15, 22, 23, 30, 31, 38, 39, 46, 47, 54, 55, 62, 63];

    function* generatePosition(positions) {
      const randomPosition = positions[Math.floor(Math.random() * positions.length)];
      yield randomPosition;
    }

    function positionedTeam(team, positions) {
      const positioned = [];
      for (const character of team) {
        const obj = new PositionedCharacter(character, generatePosition(positions).next().value);
        positioned.push(obj);
      }

      for (let i = 0; i < positioned.length; i += 1) {
        for (let j = i + 1; j < positioned.length; j += 1) {
          if (positioned[i].position === positioned[j].position) {
            positioned[i].position = generatePosition(positions).next().value;
          }
        }
      }
      return positioned;
    }

    const playerPositionedTeam = positionedTeam(playerTeam, playerPosition);
    const enemyPositionedTeam = positionedTeam(enemyTeam, enemyPosition);
    this.userTeam = playerPositionedTeam;
    this.botTeam = enemyPositionedTeam;

    this.gamePlay.redrawPositions([...playerPositionedTeam, ...enemyPositionedTeam]);

    this.gamePlay.addCellEnterListener(this.onCellEnter.bind(this));
    this.gamePlay.addCellClickListener(this.onCellClick.bind(this));
    this.gamePlay.addCellLeaveListener(this.onCellLeave.bind(this));

    if (this.level === 5 || this.userTeam.length === 0) {
      return;
    }
  }
  // TODO: add event listeners to gamePlay events
  // TODO: load saved stated from stateService

  // метод, возвращающий любого персонажа на определенной позиции
  getCharPos(index) {
    return [...this.userTeam, ... this.botTeam].find(el => el.position === index);
  }

  // метод возвращает выбранного персонажа на определенной позиции и записывает эту позицию в свойство selected в GameState
  getSelectedCharPos() {
    return [...this.userTeam, ... this.botTeam].find(el => el.position === this.gameState.selected)
  }

  //проверка принадлежности персонажа пользователю
  isUserCharacter(index) {
    if (this.getCharPos(index)) {
      const character = this.getCharPos(index).character;
      return this.userCharacters.some(el => character instanceof el);
    }
    return false
  }

  isBotCharacter(index) {
    if (this.getCharPos(index)) {
      const character = this.getCharPos(index).character;
      return this.botCharacters.some(el => character instanceof el);
    }
    return false
  }

  //метод рассчитывает диапазон перемещения или атаки персонажа
  calcMoveAttack(index, charParam) {
    const boardSize = this.boardSize;
    const range = [];
    const leftBorder = [];
    const rightBorder = [];

    for (let i = 0, j = boardSize - 1; leftBorder.length < boardSize; i += boardSize, j += boardSize) {
      leftBorder.push(i);
      rightBorder.push(j);
    }

    for (let i = 1; i <= charParam; i += 1) {
      range.push(index + (boardSize * i));
      range.push(index - (boardSize * i));
    }

    for (let i = 1; i <= charParam; i += 1) {
      if (leftBorder.includes(index)) {
        break;
      }
      range.push(index - i);
      range.push(index - (boardSize * i + i));
      range.push(index + (boardSize * i - i));
      if (leftBorder.includes(index - i)) {
        break;
      }
    }

    for (let i = 1; i <= charParam; i += 1) {
      if (rightBorder.includes(index)) {
        break;
      }
      range.push(index + i);
      range.push(index - (boardSize * i - i));
      range.push(index + (boardSize * i + i));
      if (rightBorder.includes(index + i)) {
        break;
      }
    }

    return range.filter((elem) => elem >= 0 && elem <= (boardSize ** 2 - 1));
  }

  //проверка валидности диапазона перемещения
  allowedMove(index) {
    if (this.getSelectedCharPos()) {
      const move = this.getSelectedCharPos().character.move;
      const moveArray = this.calcMoveAttack(this.gameState.selected, move);
      return moveArray.includes(index);
    }
    return false
  }

  //перемещение персонажа
  characterMove(index) {
    this.getSelectedCharPos().position = index;
    this.gamePlay.deselectCell(this.gameState.selected);
    this.gamePlay.redrawPositions([...this.userTeam, ...this.botTeam]);
    this.gameState.selected = index;
    this.gamePlay.selectCell(this.gameState.selected, 'yellow');
    this.gameState.userTurn = false;
    this.botAttack();
  }

  //проверка валидности диапазона атаки
  allowedAttack(index) {
    if (this.getSelectedCharPos()) {
      const attack = this.getSelectedCharPos().character.attackDistance;
      const attackArray = this.calcMoveAttack(this.gameState.selected, attack);
      return attackArray.includes(index);
    }
    return false
  }

  //удаление персонажа с поля в случае потери здоровья
  deleteChar(index) {
    const pos = [...this.userTeam, ...this.botTeam];
    pos.splice(pos.indexOf(this.getCharPos(index)), 1);
  }

  //атака персонажа
  characterAttack(index) {
    if (this.gameState.userTurn) {
      const user = this.getCharPos(this.gameState.selected).character;
      const bot = this.getCharPos(index).character;
      const damage = Math.max(user.attack - bot.defence, user.attack * 0, 1);
      if (this.userTeam.length === 0 || this.botTeam.length === 0) {
        return
      }

      this.gamePlay.showDamage(index, damage)
        .then(() => {
          bot.health -= damage;
          if (bot.health <= 0) {
            this.deleteChar(index);
            this.botTeam.splice(this.botTeam.indexOf(bot), 1);
          }
        })
        .then(() => {
          this.gamePlay.redrawPositions([...this.userTeam, ... this.botTeam]);
        })
      .then(() => {
      //this.gameState.getResult();
        this.botAttack();
      })

      this.gameState.userTurn = false;
    }
  }

  //атака и перемещение бота
  botAttack() {
    if (this.gameState.userTur) {
      return
    }
    let bot = null;
    let user = null;

    this.botTeam.forEach(el => {
      const moveAttack = this.calcMoveAttack(el.position, el.character.attackDistance);
      this.userTeam.forEach(item => {
        if (moveAttack.includes(item.position)) {
          bot = el;
          user = item;
        }
      })
    })

    if (user) {
      const damage = Math.max(bot.character.attack - user.character.defence, bot.character.attack * 0, 1);
      this.gamePlay.showDamage(user.position, damage)
        .then(() => {
          user.character.health -= damage;
          if (user.character.health <= 0) {
            this.deleteChar(user.position);
            this.userTeam.splice(this.userTeam.indexOf(user.character), 1);
            this.gamePlay.deselectCell(this.gameState.selected);
            this.gameState.selected = null;
          }
        })
        .then(() => {
          this.gamePlay.redrawPositions([...this.userTeam, ...this.botTeam]);
          this.gameState.userTurn = true;
        })
      // .then(() => {
      //   this.gameState.getResult();
      // })
    } else {
        bot = this.botTeam[Math.floor(Math.random() * this.botTeam.length)];
        const botMove = this.calcMoveAttack(bot.position, bot.character.move);
        botMove.forEach(item => {
          [...this.userTeam, ...this.botTeam].forEach(el => {
            if (item === el.position) {
              botMove.splice(botMove.indexOf(el.position), 1);
            }
          });
        });
        const botPosition = botMove[Math.floor(Math.random() * botMove.length)];
        bot.position = botPosition;
        this.gamePlay.redrawPositions([...this.userTeam, ...this.botTeam]);
        this.gameState.userTurn = true;
    }


  }

  onCellClick(index) {
    // выделение выбранного персонажа команды игрока
    if (this.getCharPos(index) && this.isUserCharacter(index)) {
      this.gamePlay.cells.forEach((i) => i.classList.remove('selected', 'selected-yellow'));
      this.gamePlay.selectCell(index, 'yellow');
      this.gameState.selected = index;
    }

    //вывод сообщений о недопустимых действиях
    if (this.getCharPos(index) && !this.isUserCharacter(index) && !this.allowedAttack(index)) {
      GamePlay.showError('Это не ваш игрок!');
    } if (this.gameState.selected !== null && !this.allowedMove(index) && !this.allowedAttack(index)) {
      if (!this.getCharPos(index)) {
        GamePlay.showError('Недопустимый ход!');
      }
    }

    //вызов метода перемещения персонажа игрока
    if (this.gameState.selected !== null && !this.getCharPos(index) && this.allowedMove(index)) {
      if (this.gameState.userTurn) {
        this.characterMove(index)
      }
    }

    //вызов метода атаки персонажа игрока
    if (this.gameState.selected !== null && this.getCharPos(index) && this.isBotCharacter(index)) {
      if (this.allowedAttack(index)) {
        this.characterAttack(index)
      }
    }
  }

  onCellEnter(index) {
    //смена курсора при наведении на персонажа пользователя
    if (this.getCharPos(index) && this.isUserCharacter(index)) {
      this.gamePlay.setCursor('pointer');
    }
    //отображение состояния персонажа
    if (this.getCharPos(index) !== undefined) {
      this.gamePlay.showCellTooltip(`${String.fromCodePoint(0x1F396)}:${this.getCharPos(index).character.level}${String.fromCodePoint(0x2694)}:${this.getCharPos(index).character.attack}${String.fromCodePoint(0x1F6E1)}:${this.getCharPos(index).character.defence}${String.fromCodePoint(0x2764)}:${this.getCharPos(index).character.health}`, index);
    }
    //смена курсора и выделение ячейки в соответствии с валидным диапазоном перемещения персонажа
    if (!this.getCharPos(index) && this.allowedMove(index) && this.gameState.selected !== null) {
      this.gamePlay.setCursor('pointer');
      this.gamePlay.selectCell(index, 'green');
    }
    //смена курсора и выделения ячейки в соответствии с валидным диапазоном атаки персонажа
    if (this.getCharPos(index) && this.gameState.selected !== null) {
      if (!this.isUserCharacter(index) && this.allowedAttack(index)) {
        this.gamePlay.setCursor('crosshair');
        this.gamePlay.selectCell(index, 'red');
      }
    }
    //смена курсора при недопустимости действий
    if (this.gameState.selected !== null && !this.getCharPos(index) || this.isBotCharacter(index)) {
      if (!this.allowedAttack(index) && !this.allowedMove(index)) {
        this.gamePlay.setCursor('not-allowed');
      }
    }

  }

  onCellLeave(index) {
    this.gamePlay.hideCellTooltip(index);
    this.gamePlay.cells.forEach((elem) => elem.classList.remove('selected-red'));
    this.gamePlay.cells.forEach((elem) => elem.classList.remove('selected-green'));
    this.gamePlay.setCursor('auto');
  }
}
