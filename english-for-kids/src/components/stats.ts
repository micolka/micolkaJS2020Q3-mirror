/* eslint-disable import/extensions */
import state, { TCardsData } from '../appState';
import cards from '../cardsConfig';
import { resetMainPage } from '../gameEngine';
import { createStatsData, saveStatsToLocalStorage } from '../statsLogger';
import { createIconHTML, getRootElement } from '../utils';
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
          result = a.cells[thIndex].innerHTML < b.cells[thIndex].innerHTML ? 1 : -1;
        } else {
          result = +a.cells[thIndex].innerHTML < +b.cells[thIndex].innerHTML ? 1 : -1;
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
  if (sortedRows.length === 0) {
    return null;
  }
  sortedRows.forEach((elem) => {
    const [collectionIndex, cardIndex] = elem;
    cardsData.push(cards.data[+collectionIndex][+cardIndex]);
  });

  return cardsData;
}

export function removeStatsButtons() {
  const rootDiv: HTMLElement = document.querySelector('.stars_wrapper');
  rootDiv.classList.remove('stats-buttons-wrapper');
  rootDiv.innerHTML = '';
}

function repeatHardWords() {
  removeStatsButtons();
  state.isRepeatModeOn = true;
  getSwitchButton().classList.remove('invisible');
  const rootDiv: HTMLElement = getRootElement();
  state.currentCollection = generateCardsForRepeating();
  if (state.currentCollection) {
    const cardsContent:string[] = state.currentCollection
      .map((elem, index) => getTrainCardInnerHTML(elem, index));
    rootDiv.innerHTML = cardsContent.join('');
    addListenersToCards();
  } else {
    rootDiv.style.flexDirection = 'column';
    rootDiv.innerHTML = `
    <img class="lose-win-picture" src="./assets/img/_nothing.png" alt="win">
    <div class="lose-win-message" >Nothing to train...</div>
  `;

    setTimeout(() => {
      rootDiv.style.flexDirection = 'row';
      resetMainPage();
    }, 3000);
  }
}

export function generateStatsPage() {
  const rootDiv: HTMLElement = getRootElement();
  rootDiv.innerHTML = '';
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
          <td>${counter}</td><td class="table-stats_set">${set}</td><td>${card.word}</td><td>${card.translation}</td>
          <td>${clicksCount}</td><td>${rightCount}</td><td>${wrongCount}</td><td>${percent}</td>
        </tr>
      `);
    });
  });

  rootDiv.innerHTML = `
    <table class="stats_table">
      <tr>
        <th>№</th><th class="table-stats_set">Set</th><th>Word</th><th>Translation</th>
        <th>${createIconHTML('fitness_center')}</th>
        <th>${createIconHTML('check')}</th>
        <th>${createIconHTML('clear')}</th>
        <th>%</th>
      </tr>
      ${rowsArray.join('')}
    </table>
  `;

  addEventListeners();
}

export function insertStatsButtons() {
  const rootDiv: HTMLElement = document.querySelector('.stars_wrapper');
  rootDiv.classList.add('stats-buttons-wrapper');
  rootDiv.innerHTML = `<div class="stats-btn repeat-words">Repeat difficult words</div>
                      <div class="stats-btn reset">Reset</div>`;

  const repeat = document.querySelector('.repeat-words');
  repeat.addEventListener('click', repeatHardWords);

  const reset = document.querySelector('.reset');
  reset.addEventListener('click', () => {
    createStatsData();
    saveStatsToLocalStorage();
    generateStatsPage();
  });
}
