export function getFormattedTimerData(duration) {
  function addZero(param) {
    const result = param < 10 ? `0${param}` : param;
    return result;
  }

  const hours = addZero(Math.floor((duration % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)));
  const minutes = addZero(Math.floor((duration % (1000 * 60 * 60)) / (1000 * 60)));
  const seconds = addZero(Math.floor((duration % (1000 * 60)) / 1000));

  return `${hours}:${minutes}:${seconds}`;
}

export const createIconHTML = (icon) => `<i class="material-icons">${icon}</i>`;

export const genUrlNumber = () => Math.floor(Math.random() * 149) + 1;

export function playSound(filename, isSoundOn, audioOutput) {
  const audio = audioOutput;
  if (isSoundOn) {
    audio.preload = 'auto';
    audio.src = `assets/sound/${filename}.mp3`;
    audio.play();
  }
}
