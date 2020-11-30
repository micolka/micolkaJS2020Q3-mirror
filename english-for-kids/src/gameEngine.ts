/* eslint-disable import/extensions */
import state from './appState';
import { genPseudoRandom } from './utils';

export function startNewGame() {
  state.gameStatus.wordsIdList = genPseudoRandom();
  state.isGameStarted = true;
  // повесить какой-нибудь звук начала игры
}

export function nextGameStep() {

}