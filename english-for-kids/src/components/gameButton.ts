/* eslint-disable import/extensions */
import state from '../appState';
import { playSoundWithDelay, startNewGame } from '../gameEngine';
import { playSound } from '../utils';
import { saveStatsToLocalStorage } from './statistics';

export function showGameButton() {
  const gameButton:HTMLElement = document.querySelector('.start-game-btn');
  gameButton.classList.toggle('visible');
}

function prepareToGame(gameButton:HTMLElement) {
  const btn:HTMLElement = gameButton;
  saveStatsToLocalStorage();
  if (!state.isGameStarted) {
    btn.innerText = 'Repeat';
    btn.classList.add('repeat');
    playSound('audio/_click.mp3', state.audioInstance);
    startNewGame();
  } else {
    playSoundWithDelay();
  }
}

export function initStartGameButton() {
  const gameButton:HTMLElement = document.querySelector('.start-game-btn');

  gameButton.addEventListener('click', () => {
    prepareToGame(gameButton);
  });
}

export function resetGameButton() {
  const gameButton:HTMLElement = document.querySelector('.start-game-btn');
  gameButton.classList.remove('visible');
  gameButton.classList.remove('repeat');
  gameButton.innerText = 'Start Game';
}
