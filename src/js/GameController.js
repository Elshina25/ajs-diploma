import GamePlay from './GamePlay';
import themes from './themes';
import PositionedCharacter from './PositionedCharacter';
import Daemon from './characters/Daemon';
import Magician from './characters/Magician';
import Vampire from './characters/Vampire';
import Bowman from './characters/Bowman';
import Swordsman from './characters/Swordsman';
import Undead from './characters/Undead';
import Team from './Team';
import { generateTeam } from './generators';
import GameState from './GameState';

export default class GameController {
  constructor(gamePlay, stateService) {
    this.gamePlay = gamePlay;
    this.stateService = stateService;
    this.boardSize = gamePlay.boardSize;
    this.userCharacters = [Bowman, Swordsman, Magician];
    this.botCharacters = [Daemon, Vampire, Undead];
    this.userTeam = new Team();
    this.botTeam = new Team();
    this.gameState = new GameState();
  }

  init() {
    this.gamePlay.drawUi(themes(this.level));
    if (this.gameState.level === 2) {
      this.gamePlay.drawUi(themes(2));
    } if (this.gameState.level === 3) {
      this.gamePlay.drawUi(themes(3));
    } if (this.gameState.level === 4) {
      this.gamePlay.drawUi(themes(4));
    }

    this.userTeam.addAll(generateTeam(this.userCharacters, this.gameState.level, 3));
    this.positionedTeam(this.userTeam, this.userStartPositions());
    this.botTeam.addAll(generateTeam(this.botCharacters, this.gameState.level, 3));
    this.positionedTeam(this.botTeam, this.botStartPositions());
    this.gamePlay.redrawPositions(this.gameState.positions);

    this.gamePlay.addCellEnterListener(this.onCellEnter.bind(this));
    this.gamePlay.addCellClickListener(this.onCellClick.bind(this));
    this.gamePlay.addCellLeaveListener(this.onCellLeave.bind(this));
    this.gamePlay.addNewGameListener(this.onNewGameClick.bind(this));
    this.gamePlay.addLoadGameListener(this.onLoadGameClick.bind(this));
    this.gamePlay.addSaveGameListener(this.onSaveGameClick.bind(this));
  }

  // метод, возвращающий массив возможных стартовых позиций персонажей пользователя
  userStartPositions() {
    const startPos = [];
    const board = this.boardSize;
    for (let i = 0, j = 1; startPos.length < board * 2; i += board, j += board) {
      startPos.push(i, j);
    }
    return startPos;
  }

  // метод, возвращающий массив возможных стартовых позиций персонажей бота
  botStartPositions() {
    const startPos = [];
    const board = this.boardSize;
    for (let i = board - 2, j = board - 1; startPos.length < board * 2; i += board, j += board) {
      startPos.push(i, j);
    }
    return startPos;
  }

  // метод, возвращающий случайную позицию из списка возможных
  generatePosition(positions) {
    const randomPosition = positions[Math.floor(Math.random() * positions.length)];
    return randomPosition;
  }

  // метод привязывает персонажей к позициям и пушит в gameSate.positions
  positionedTeam(team, positions) {
    const positionsForSplice = [...positions];
    for (const character of team) {
      const position = this.generatePosition(positionsForSplice);
      this.gameState.positions.push(new PositionedCharacter(character, position));
      positionsForSplice.splice(positionsForSplice.indexOf(position), 1);
    }
  }

  // метод, возвращающий любого персонажа на определенной позиции
  getCharPos(index) {
    return this.gameState.positions.find((el) => el.position === index);
  }

  // метод возвращает выбранного персонажа на определенной позиции
  getSelectedCharPos() {
    return this.gameState.positions.find((el) => el.position === this.gameState.selected);
  }

  // проверка принадлежности персонажа пользователю
  isUserChar(index) {
    if (this.getCharPos(index)) {
      const { character } = this.getCharPos(index);
      return this.userCharacters.some((el) => character instanceof el);
    }
    return false;
  }

  // проверка принадлежности персонажа боту
  isBotChar(index) {
    if (this.getCharPos(index)) {
      const { character } = this.getCharPos(index);
      return this.botCharacters.some((el) => character instanceof el);
    }
    return false;
  }

  // метод рассчитывает диапазон перемещения или атаки персонажа
  calcMoveAttack(index, charParam) {
    const board = this.boardSize;
    const range = [];
    const leftBord = [];
    const rightBord = [];

    for (let i = 0, j = board - 1; leftBord.length < board; i += board, j += board) {
      leftBord.push(i);
      rightBord.push(j);
    }

    for (let i = 1; i <= charParam; i += 1) {
      range.push(index + (board * i));
      range.push(index - (board * i));
    }

    for (let i = 1; i <= charParam; i += 1) {
      if (leftBord.includes(index)) {
        break;
      }
      range.push(index - i);
      range.push(index - (board * i + i));
      range.push(index + (board * i - i));
      if (leftBord.includes(index - i)) {
        break;
      }
    }

    for (let i = 1; i <= charParam; i += 1) {
      if (rightBord.includes(index)) {
        break;
      }
      range.push(index + i);
      range.push(index - (board * i - i));
      range.push(index + (board * i + i));
      if (rightBord.includes(index + i)) {
        break;
      }
    }

    return range.filter((elem) => elem >= 0 && elem <= (board ** 2 - 1));
  }

  // проверка валидности диапазона перемещения
  allowedMove(index) {
    if (this.getSelectedCharPos()) {
      const { move } = this.getSelectedCharPos().character;
      const moveArray = this.calcMoveAttack(this.gameState.selected, move);
      return moveArray.includes(index);
    }
    return false;
  }

  // перемещение персонажа
  characterMove(index) {
    this.getSelectedCharPos().position = index;
    this.gamePlay.deselectCell(this.gameState.selected);
    this.gamePlay.redrawPositions(this.gameState.positions);
    this.gameState.selected = index;
    this.gamePlay.selectCell(this.gameState.selected, 'yellow');
    this.gameState.userTurn = false;
    this.botAttack();
  }

  // проверка валидности диапазона атаки
  allowedAttack(index) {
    if (this.getSelectedCharPos()) {
      const attack = this.getSelectedCharPos().character.attackDistance;
      const attackArray = this.calcMoveAttack(this.gameState.selected, attack);
      return attackArray.includes(index);
    }
    return false;
  }

  // удаление убитого персонажа из массива gamestate.positions
  deleteFromPosition(index) {
    const state = this.gameState.positions;
    state.splice(state.indexOf(this.getCharPos(index)), 1);
  }

  // атака персонажа
  characterAttack(index) {
    const user = this.getCharPos(this.gameState.selected).character;
    const bot = this.getCharPos(index).character;
    const damage = Math.max(user.attack - bot.defence, user.attack * 0.1);

    if (this.gameState.userTurn) {
      this.gamePlay.showDamage(index, damage)
        .then(() => {
          bot.health -= damage;
          if (bot.health <= 0) {
            this.deleteFromPosition(index);
            this.botTeam.delete(bot);
          }
        })
        .then(() => {
          this.gamePlay.redrawPositions(this.gameState.positions);
        })
        .then(() => {
          this.getResult();
          this.botAttack();
        });

      this.gameState.points += damage;
      this.gameState.userTurn = false;
    }
  }

  // атака и перемещение бота
  botAttack() {
    if (this.gameState.userTurn) {
      return;
    }
    let bot = null;
    let user = null;

    const userTeam = this.gameState.positions.filter((el) => (
      el.character instanceof Magician
      || el.character instanceof Bowman
      || el.character instanceof Swordsman
    ));
    const botTeam = this.gameState.positions.filter((el) => (
      el.character instanceof Daemon
      || el.character instanceof Vampire
      || el.character instanceof Undead
    ));

    botTeam.forEach((el) => {
      const moveAttack = this.calcMoveAttack(el.position, el.character.attackDistance);
      userTeam.forEach((item) => {
        if (moveAttack.includes(item.position)) {
          bot = el;
          user = item;
        }
      });
    });

    if (userTeam.length === 0 || botTeam.length === 0) {
      return;
    }

    if (user) {
      const botDamage = bot.character.attack - user.character.defence;
      const damage = Math.max(botDamage, bot.character.attack * 0.1);
      this.gamePlay.showDamage(user.position, damage)
        .then(() => {
          user.character.health -= damage;
          if (user.character.health <= 0) {
            this.userTeam.delete(user.character);
            this.deleteFromPosition(user.position);
            this.gamePlay.deselectCell(this.gameState.selected);
            this.gameState.selected = null;
          }
        })
        .then(() => {
          this.gamePlay.redrawPositions(this.gameState.positions);
          this.gameState.userTurn = true;
        })
        .then(() => {
          this.getResult();
        });
    } else {
      bot = botTeam[Math.floor(Math.random() * botTeam.length)];
      const botMove = this.calcMoveAttack(bot.position, bot.character.move);
      botMove.forEach((item) => {
        this.gameState.positions.forEach((el) => {
          if (item === el.position) {
            botMove.splice(botMove.indexOf(el.position), 1);
          }
        });
      });
      const botPosition = botMove[Math.floor(Math.random() * botMove.length)];
      bot.position = botPosition;
      this.gamePlay.redrawPositions(this.gameState.positions);
      this.gameState.userTurn = true;
    }
  }

  // вывод информации о набранных очках и передача ее в статистику
  getResult() {
    if (this.userTeam.team.size === 0) {
      this.gameState.statistics.push(this.gameState.points);
      GamePlay.showMessage(`Вы проиграли! Количество набранных очков за игру: ${this.gameState.points}`);
    } if (this.botTeam.team.size === 0 && this.gameState.level === 4) {
      this.gameState.statistics.push(this.gameState.points);
      GamePlay.showMessage(`Вы выиграли! Количество набранных очков за игру: ${this.gameState.points}, Ваш личный рекорд: ${Math.max(...this.gameState.statistics)}`);
    } if (this.botTeam.team.size === 0 && this.gameState.level <= 3) {
      this.gameState.statistics.push(this.gameState.points);
      GamePlay.showMessage(`Уровень ${this.gameState.level} пройден! Заработанные очки: ${this.gameState.points}`);
      this.levelUpGame();
    }
  }

  // переход на другой уровень
  levelUpGame() {
    this.gameState.level += 1;
    this.gameState.userTurn = true;
    this.gameState.positions = [];
    this.userTeam.team.forEach((el) => el.levelUp());
    const userGen = generateTeam(this.userCharacters, this.gameState.level, 2);
    const botGen = generateTeam(this.botCharacters, this.gameState.level, this.userTeam.team.size);

    if (this.gameState.level === 2) {
      this.userTeam.addAll(userGen);
      this.botTeam.addAll(botGen);
    } if (this.gameState.level === 3) {
      this.userTeam.addAll(userGen);
      this.botTeam.addAll(botGen);
    } if (this.gameState.level === 4) {
      this.userTeam.addAll(userGen);
      this.botTeam.addAll(botGen);
    }

    GamePlay.showMessage(`Уровень ${this.gameState.level}`);
    this.positionedTeam(this.userTeam, this.userStartPositions());
    this.positionedTeam(this.botTeam, this.botStartPositions());
    this.gamePlay.drawUi(themes(this.gameState.level));
    this.gamePlay.redrawPositions(this.gameState.positions);
  }

  // запуск новой игры при нажатии на кнопку New Game
  onNewGameClick() {
    this.gameState.level = 1;
    this.gamePlay.drawUi(themes(this.gameState.level));
    this.userTeam = new Team();
    this.botTeam = new Team();
    this.userTeam.addAll(generateTeam(this.userCharacters, this.gameState.level, 3));
    this.botTeam.addAll(generateTeam(this.botCharacters, this.gameState.level, 3));
    this.gameState.points = 0;
    this.gameState.userTurn = true;
    this.gameState.selected = null;
    this.gameState.positions = [];

    this.positionedUserTeam = this.positionedTeam(this.userTeam, this.userStartPositions());
    this.positionedBotTeam = this.positionedTeam(this.botTeam, this.botStartPositions());

    this.gamePlay.redrawPositions(this.gameState.positions);
    GamePlay.showMessage(`Уровень ${this.gameState.level}`);
  }

  // сохранение игры при нажатии на кнопку Save Game
  onSaveGameClick() {
    this.stateService.save(GameState.from(this.gameState));
    GamePlay.showMessage('игра успешно сохранена!');
  }

  // запуск сохраненной игры при нажатии на кнопку Load Game
  onLoadGameClick() {
    GamePlay.showMessage('Загрузка игры...');
    const load = this.stateService.load();
    if (!load) {
      GamePlay.showMessage('Ошибка загрузки!');
    }
    this.gameState.statistics = load.statistics;
    this.gameState.points = load.points;
    this.gameState.userTurn = load.userTurn;
    this.gameState.selected = load.selected;
    this.gameState.positions = [];
    this.gameState.level = load.level;
    this.userTeam = new Team();
    this.botTeam = new Team();

    load.positions.forEach((el) => {
      let pers;
      switch (el.character.type) {
        case 'bowman':
          pers = new Bowman(el.character.level);
          this.userTeam.addAll([pers]);
          break;
        case 'magician':
          pers = new Magician(el.character.level);
          this.userTeam.addAll([pers]);
          break;
        case 'swordsman':
          pers = new Swordsman(el.character.level);
          this.userTeam.addAll([pers]);
          break;
        case 'daemon':
          pers = new Daemon(el.character.level);
          this.botTeam.addAll([pers]);
          break;
        case 'undead':
          pers = new Undead(el.character.level);
          this.botTeam.addAll([pers]);
          break;
        case 'vampire':
          pers = new Vampire(el.character.level);
          this.botTeam.addAll([pers]);
          break;
          // no default
      }
      pers.health = el.character.health;
      this.gameState.positions.push(new PositionedCharacter(pers, el.position));
    });
    this.gamePlay.drawUi(themes(this.gameState.level));
    this.gamePlay.redrawPositions(this.gameState.positions);
  }

  onCellClick(index) {
    if (this.gameState.level === 5 || this.userTeam.team.size === 0) {
      return;
    }
    const allowedMove = this.allowedMove(index);
    const allowedAttack = this.allowedAttack(index);

    // выделение выбранного персонажа команды игрока
    if (this.getCharPos(index) && this.isUserChar(index)) {
      this.gamePlay.cells.forEach((i) => i.classList.remove('selected', 'selected-yellow'));
      this.gamePlay.selectCell(index, 'yellow');
      this.gameState.selected = index;
    }

    // вывод сообщений о недопустимых действиях
    if (this.getCharPos(index) && !this.isUserChar(index) && !allowedAttack) {
      GamePlay.showError('Это не ваш игрок!');
    } if (this.gameState.selected !== null && !allowedMove && allowedAttack) {
      if (!this.getCharPos(index)) {
        GamePlay.showError('Недопустимый ход!');
      }
    }

    // вызов метода перемещения персонажа игрока
    if (this.gameState.selected !== null && !this.getCharPos(index) && allowedMove) {
      if (this.gameState.userTurn) {
        this.characterMove(index);
      }
    }

    // вызов метода атаки персонажа игрока
    if (this.gameState.selected !== null && this.getCharPos(index) && this.isBotChar(index)) {
      if (allowedAttack) {
        this.characterAttack(index);
      }
    }
  }

  onCellEnter(index) {
    // смена курсора при наведении на персонажа пользователя
    if (this.getCharPos(index) && this.isUserChar(index)) {
      this.gamePlay.setCursor('pointer');
    }
    // отображение состояния персонажа
    if (this.getCharPos(index) !== undefined) {
      this.gamePlay.showCellTooltip(`${String.fromCodePoint(0x1F396)}:${this.getCharPos(index).character.level}${String.fromCodePoint(0x2694)}:${this.getCharPos(index).character.attack}${String.fromCodePoint(0x1F6E1)}:${this.getCharPos(index).character.defence}${String.fromCodePoint(0x2764)}:${this.getCharPos(index).character.health}`, index);
    }
    // смена курсора и выделение ячейки в соответствии с валидным диапазоном перемещения персонажа
    if (!this.getCharPos(index) && this.allowedMove(index) && this.gameState.selected !== null) {
      this.gamePlay.setCursor('pointer');
      this.gamePlay.selectCell(index, 'green');
    }
    // смена курсора и выделения ячейки в соответствии с валидным диапазоном атаки персонажа
    if (this.getCharPos(index) && this.gameState.selected !== null) {
      if (!this.isUserChar(index) && this.allowedAttack(index)) {
        this.gamePlay.setCursor('crosshair');
        this.gamePlay.selectCell(index, 'red');
      }
    }
    // смена курсора при недопустимости действий
    if (this.gameState.selected !== null && (!this.getCharPos(index) || this.isBotChar(index))) {
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
