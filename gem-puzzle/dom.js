export function createButton({ classProp, innerText, eventListener }) {
  const elem = document.createElement('button');
  elem.classList.add(classProp);
  elem.classList.add('btn');
  elem.innerText = innerText;
  elem.addEventListener('click', () => {
    eventListener();
  });
  return elem;
}

export function createAnyElement({ elementType, classProp, innerText }) {
  const elem = document.createElement(elementType);
  elem.classList.add(classProp);
  elem.innerText = innerText;
  return elem;
}

export function toggleDisabledProp(selectors, flag) {
  selectors.forEach((el) => {
    if (el) document.querySelector(el).disabled = flag;
  });
}
