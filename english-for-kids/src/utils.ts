/* eslint-disable import/extensions */
import state from './appState';

export const createIconHTML = (icon:string) => `<i class="material-icons">${icon}</i>`;

export function playSound(filename:string, audioElem:HTMLAudioElement): void {
  if (state.currentHash === '') return;
  const audio = audioElem;
  audio.preload = 'auto';
  audio.src = `assets/${filename}`;
  audio.play();
}
