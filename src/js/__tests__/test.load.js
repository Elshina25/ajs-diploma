import GamePlay from '../GamePlay';
import GameStateService from '../GameStateService';

test('mock return error without data to load', () => {
  const stateService = new GameStateService(null);
  const mock = jest.fn(() => GamePlay.showError('Ошибка загрузки: данные не найдены'));
  GamePlay.showError = jest.fn();

  try {
    stateService.load();
  } catch (e) {
    mock();
  }
  expect(mock).toHaveBeenCalled();
});
