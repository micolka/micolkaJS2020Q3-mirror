export const createIconHTML = (icon:string) => `<i class="material-icons">${icon}</i>`;

export function playSound(filename:string, audioElem:HTMLAudioElement): void {
  const audio = audioElem;
  audio.preload = 'auto';
  audio.src = `assets/${filename}`;
  audio.play();
}

export function genPseudoRandom() {
  const arr = [0, 1, 2, 3, 4, 5, 6, 7];
  const out = [];
  for (let i = 8; i > 0; i -= 1) {
    const indx = Math.floor(Math.random() * i);
    out.push(arr[indx]);
    arr.splice(indx, 1);
  }
  return out;
}
