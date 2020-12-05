/* eslint-disable import/extensions */
import state from './appState';

export const createIconHTML = (icon:string) => `<i class="material-icons">${icon}</i>`;

export function playSound(filename:string, audioElem:HTMLAudioElement): void {
  const audio = audioElem;
  audio.preload = 'auto';
  audio.src = `assets/${filename}`;
  const audioPromise = audio.play();
  if (audioPromise !== undefined) {
    audioPromise.catch(() => {});
  }
}

export function genRandomListOfIndexes():number[] {
  const n:number = state.currentCollection.length;
  const shuffledArr:number[] = [];
  while (shuffledArr.length < n) {
    const indx = Math.floor(Math.random() * n);
    if (!shuffledArr.includes(indx)) shuffledArr.push(indx);
  }
  return shuffledArr;
}

export function getHash():string {
  return window.location.hash.slice(1);
}

export function getRootElement():HTMLElement {
  return document.querySelector('.cards_wrapper');
}
