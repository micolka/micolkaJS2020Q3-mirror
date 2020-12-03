/* eslint-disable import/extensions */
import state from '../appState';
import cards from '../cardsConfig';
import { getRootElement } from '../utils';

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
        <tr>
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
}

export function doNothing() {

}
