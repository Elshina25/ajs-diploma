import GamePlay from './GamePlay';
import themes from './themes';
import PositionedCharacter from './PositionedCharacter';
import Daemon from './characters/Daemon';
import Magician from './characters/Magician';
import Vampire from './characters/Vampire';
import Bowman from './characters/Bowman';
import Swordsman from './characters/Swordsman';
import Undead from './characters/Undead';
import Character from './Character';
import Team from './Team';
import { characterGenerator } from './generators';
import { generateTeam } from './generators';
import GameState from './GameState';

export default class GameController {
  constructor(gamePlay, stateService) {
    this.gamePlay = gamePlay;
    this.stateService = stateService;
    this.boardSize = gamePlay.boardSize;
    this.userTeam = [];
    this.botTeam = [];
    this.gameState = new GameState()
  }

  

  init() {
    this.gamePlay.drawUi(themes(this.gameState.level));
    if (this.level === 2) {
      this.gamePlay.drawUi(themes(2));
    } if (this.level === 3) {
      this.gamePlay.drawUi(themes(3));
    } if (this.level === 4) {
      this.gamePlay.drawUi(themes(4));
    } 

    const playerTeam = generateTeam([Bowman, Swordsman, Magician], this.gameState.level, 3).next().value;
    const enemyTeam = generateTeam([Vampire, Daemon, Undead], this.gameState.level, 3).next().value;
    const playerPosition = [0, 1, 8, 9, 16, 17, 24, 25, 32, 33, 40, 41, 48, 49, 56, 57];
    const enemyPosition = [6, 7, 14, 15, 22, 23, 30, 31, 38, 39, 46, 47, 54, 55, 62, 63];

    function* generatePosition(positions) {
      const randomPosition = positions[Math.floor(Math.random() * positions.length)];
      yield randomPosition
      
    }

    function positionedTeam(team, positions) {
      const positioned = [];
      for (let character of team) {
        const obj = new PositionedCharacter(character, generatePosition(positions).next().value);
        positioned.push(obj);
      }

      for (let i = 0; i < positioned.length; i += 1) {
        for (let j = i + 1; j < positioned.length; j += 1) {
          if (positioned[i].position === positioned[j].position) {
            positioned[i].position = generatePosition(positions).next().value;
            if (positioned[i] !==positioned[j].position) {
              return positioned
            } else {
              return
            }

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
    // new PositionedCharacter(this.playerCharacters, playerPosition)

    this.gamePlay.addCellEnterListener(this.onCellEnter.bind(this));
    this.gamePlay.addCellClickListener(this.onCellClick.bind(this));
    this.gamePlay.addCellLeaveListener(this.onCellLeave.bind(this));

    if (this.gameState.level === 5 || this.userTeam.length === 0) {
      return;
    }
  }
    // TODO: add event listeners to gamePlay events
    // TODO: load saved stated from stateService


  onCellClick(index) {
    //выделение выбранного персонажа команды игрока
    let cellCharacter;
    [...this.userTeam, ...this.botTeam].forEach(el => {
      if (el.position === index) {
        cellCharacter = el;
        if (this.userTeam.includes(cellCharacter)) {
          this.gamePlay.cells.forEach(i => i.classList.remove('selected', 'selected-yellow'))
          this.gamePlay.selectCell(index, 'yellow');
          this.gameState.selected = true;

          //перемещение игроков на поле
          switch(el.position) {
            case 'top': 
              el.position -= el.character.move * this.boardSize;
              break;
            case 'bottom':
              el.position += el.character.move + this.boardSize;
              break;
            case 'left':
              el.position - el.character.move;
              break;
            case 'right':
              el.position + el.character.move;
              break;
  
          }
        } else {
          GamePlay.showError('Не туда!')
        }
      } 
      
    });


  }

  onCellEnter(index) {
    let cellCharacter;
    [...this.userTeam, ...this.botTeam].forEach(el => {
      if (el.position === index) {
        cellCharacter = el;        
      } if (cellCharacter !== undefined) {
        this.gamePlay.showCellTooltip(`${String.fromCodePoint(0x1F396)}:${cellCharacter.character.level}${String.fromCodePoint(0x2694)}:${cellCharacter.character.attack}${String.fromCodePoint(0x1F6E1)}:${cellCharacter.character.defence}${String.fromCodePoint(0x2764)}:${cellCharacter.character.health}`, index);
      } if (this.userTeam.includes(cellCharacter)) {
        this.gamePlay.setCursor('pointer');
      } if (el.position !== index && this.gameState.selected === true) {
        this.gamePlay.setCursor('pointer');
        this.gamePlay.selectCell(index, 'green')

      }
    });


    // selectCell
  
  }

  onCellLeave(index) {
    this.gamePlay.hideCellTooltip(index)
  }
}
