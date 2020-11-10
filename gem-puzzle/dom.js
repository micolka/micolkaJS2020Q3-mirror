export function createButton(elClass, innerText, fn) {
  const elem = document.createElement('button');
  elem.classList.add(elClass);
  elem.classList.add('btn');
  elem.innerText = innerText;
  elem.addEventListener('click', () => {
    fn();
  });
  return elem;
}

export function createAnyElement(type, elClass, innerText) {
  const elem = document.createElement(type);
  elem.classList.add(elClass);
  elem.innerText = innerText;
  return elem;
}
