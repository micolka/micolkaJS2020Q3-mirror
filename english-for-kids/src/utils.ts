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
  const arr = [0, 1, 2, 3, 4, 5, 6, 7];
  const shuffledArr = [];
  for (let i = 8; i > 0; i -= 1) {
    const indx = Math.floor(Math.random() * i);
    shuffledArr.push(arr[indx]);
    arr.splice(indx, 1);
  }
  return shuffledArr;
}

export function getHash():string {
  return window.location.hash.slice(1);
}

export function getRootElement():HTMLElement {
  return document.querySelector('.cards_wrapper');
}
