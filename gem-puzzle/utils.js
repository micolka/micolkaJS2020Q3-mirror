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
