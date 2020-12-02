export const createIconHTML = (icon:string) => `<i class="material-icons">${icon}</i>`;

export function playSound(filename:string, audioElem:HTMLAudioElement): void {
  const audio = audioElem;
  audio.preload = 'auto';
  audio.src = `assets/${filename}`;
  audio.play();
}

export function genRandomListOfIndexes() {
  const arr = [0, 1, 2, 3, 4, 5, 6, 7];
  const shuffledArr = [];
  for (let i = 8; i > 0; i -= 1) {
    const indx = Math.floor(Math.random() * i);
    shuffledArr.push(arr[indx]);
    arr.splice(indx, 1);
  }
  return shuffledArr;
}

export function getHash() {
  return window.location.hash.slice(1);
}
