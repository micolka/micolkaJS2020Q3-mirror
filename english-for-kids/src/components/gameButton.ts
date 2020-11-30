/* eslint-disable import/extensions */
import state from '../appState';
import { startNewGame } from '../gameEngine';
import { playSound } from '../utils';

export function showGameButton() {
  const gameButton:HTMLElement = document.querySelector('.start-game-btn');
  gameButton.classList.toggle('visible');
}

function prepareToGame(gameButton:HTMLElement, audio:HTMLAudioElement) {
  const btn:HTMLElement = gameButton;
  if (!state.isGameStarted) {
    btn.innerText = 'Repeat';
    btn.classList.add('repeat');
    playSound('audio/_click.mp3', audio);
    startNewGame();
  } else {
    // повторять текущий аудио
  }
}

export function initStartGameButton(audio:HTMLAudioElement) {
  const gameButton:HTMLElement = document.querySelector('.start-game-btn');

  gameButton.addEventListener('click', () => {
    prepareToGame(gameButton, audio);
  });
}
