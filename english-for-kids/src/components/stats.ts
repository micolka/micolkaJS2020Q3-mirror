/* eslint-disable import/extensions */
import state from '../appState';
import cards from '../cardsConfig';
import { getRootElement } from '../utils';

export function generateStatsPage() {
  const rootDiv: HTMLElement = getRootElement();
  const rowsArray:string[] = [];
  let counter:number = 0;

  cards.data.forEach((collection, colIndex) => {
    const set:string = cards.categories[colIndex];
    collection.forEach((card, cardIndex) => {
      const { clicksCount, wrongCount, rightCount } = state.logData[colIndex][cardIndex];
      const percent = (wrongCount + rightCount) === 0
        ? 0 : (rightCount * 100) / (wrongCount + rightCount);
      counter += 1;
      rowsArray.push(`
        <tr>
          <td>${counter}</td><td>${set}</td><td>${card.word}</td><td>${card.translation}</td>
          <td>${clicksCount}</td><td>${rightCount}</td><td>${wrongCount}</td><td>${percent}%</td>
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
}

export function doNothing() {

}
