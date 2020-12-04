/* eslint-disable import/extensions */
import state, { TCardsData } from '../appState';
import cards from '../cardsConfig';
import { getRootElement } from '../utils';
import { addListenersToCards, getTrainCardInnerHTML } from './card';
import { getSwitchButton } from './switchButton';

function addEventListeners() {
  const table = document.querySelector('.stats_table');
  const tableHeaders = document.querySelectorAll('th');

  table.addEventListener('click', (e) => {
    let thIndex:number;

    tableHeaders.forEach((el, index) => {
      if (el === e.target) thIndex = index;
    });
    if (thIndex === undefined) return;

    const tBody = document.querySelector('tbody');
    const colName:string = tableHeaders[thIndex].innerText;
    const tableRows:NodeListOf<HTMLTableRowElement> = document.querySelectorAll('tr');
    const isSorted:boolean = tableHeaders[thIndex].classList.contains('up-down');

    const sortedRows:HTMLTableRowElement[] = Array.from(tableRows)
      .slice(1)
      .sort((a, b) => {
        let result:number;
        if (colName === 'Set' || colName === 'Word' || colName === 'Translation') {
          result = a.cells[thIndex].innerHTML > b.cells[thIndex].innerHTML ? 1 : -1;
        } else {
          result = +a.cells[thIndex].innerHTML > +b.cells[thIndex].innerHTML ? 1 : -1;
        }
        if (isSorted) result *= -1;
        return result;
      });
    tBody.append(...sortedRows);
    tableHeaders[thIndex].classList.toggle('up-down');
    tableHeaders.forEach((el, index) => {
      if (thIndex !== index) el.classList.remove('up-down');
    });
  });
}

function generateCardsForRepeating():TCardsData {
  const cardsData:TCardsData = [];
  const tableRows:NodeListOf<HTMLTableRowElement> = document.querySelectorAll('tr');
  const sortedRows = Array.from(tableRows)
    .slice(1)
    .filter((el) => el.cells[6].innerHTML !== '0')
    .sort((a, b) => {
      let out = 0;
      out = +a.cells[7].innerHTML > +b.cells[7].innerHTML ? 1 : -1;
      return out;
    })
    .filter((el, index) => index < 8)
    .map((el) => el.id.split(':'));

  sortedRows.forEach((elem) => {
    const [collectionIndex, cardIndex] = elem;
    cardsData.push(cards.data[+collectionIndex][+cardIndex]);
  });

  return cardsData;
}

function removeStatsButtons() {
  const rootDiv: HTMLElement = document.querySelector('.stars_wrapper');
  rootDiv.innerHTML = '';
}

function repeatHardWords() {
  removeStatsButtons();
  state.isRepeatModeOn = true;
  getSwitchButton().classList.remove('invisible');
  const rootDiv: HTMLElement = getRootElement();
  state.currentCollection = generateCardsForRepeating();
  const cardsContent:string[] = state.currentCollection
    .map((elem, index) => getTrainCardInnerHTML(elem, index));
  rootDiv.innerHTML = cardsContent.join('');
  addListenersToCards();
}

export function insertButtons() {
  const rootDiv: HTMLElement = document.querySelector('.stars_wrapper');
  rootDiv.classList.add('stats-buttons-wrapper');
  rootDiv.innerHTML = `<div class="stats-btn repeat-words">Repeat difficult words</div>
                      <div class="stats-btn reset">Reset</div>`;

  const repeat = document.querySelector('.repeat-words');
  repeat.addEventListener('click', repeatHardWords);

  const reset = document.querySelector('.reset');
  reset.addEventListener('click', () => {
    console.log('reset'); // !! Реализовать.
  });
}

export function generateStatsPage() {
  const rootDiv: HTMLElement = getRootElement();
  const rowsArray:string[] = [];
  let counter:number = 0;

  cards.data.forEach((collection, colIndex) => {
    const set:string = cards.categories[colIndex];
    collection.forEach((card, cardIndex) => {
      const { clicksCount, wrongCount, rightCount } = state.logData[colIndex][cardIndex];
      const percent = (wrongCount + rightCount) === 0
        ? 0 : Math.round((rightCount * 100) / (wrongCount + rightCount));
      counter += 1;
      rowsArray.push(`
        <tr id="${colIndex}:${cardIndex}">
          <td>${counter}</td><td>${set}</td><td>${card.word}</td><td>${card.translation}</td>
          <td>${clicksCount}</td><td>${rightCount}</td><td>${wrongCount}</td><td>${percent}</td>
        </tr>
      `);
    });
  });

  rootDiv.innerHTML = `
    <table class="stats_table">
      <tr>
        <th>№</th><th>Set</th><th>Word</th><th>Translation</th><th>Clicks</th><th>Correct</th><th>Wrong</th><th>%</th>
      </tr>
      ${rowsArray.join('')}
    </table>
  `;

  addEventListeners();
  insertButtons();
}
