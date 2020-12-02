/* eslint-disable import/extensions */
import cards from '../cardsConfig';

export function initBurgerMenu() {
  const mobileMenu = document.querySelector('.header-mobile-menu');
  const body = document.querySelector('body');
  const backgroundMenu = document.querySelector('.header-menu-background');
  const headerWrapper = document.querySelector('.header_wrapper');
  const { categories, hashData } = cards;

  const menuInnerHTML = categories.map((elem, index) => `<li><a class="header-nav-link" href="#${hashData[index]}">${elem}</a></li>`);
  menuInnerHTML.unshift('<li><a class="header-nav-link header-nav-active" href="#">Main</a></li>');
  const navMenu = document.querySelector('.header-nav-menu');
  navMenu.innerHTML = `<ul>${menuInnerHTML.join('')}</ul>`;
  const linksList = document.querySelectorAll('.header-nav-link');

  const toggleMobileMenu = () => {
    mobileMenu.classList.toggle('active_menu');
    navMenu.classList.toggle('active_menu');
    body.classList.toggle('active_menu');
    backgroundMenu.classList.toggle('active_menu');
  };

  mobileMenu.addEventListener('click', toggleMobileMenu);
  backgroundMenu.addEventListener('click', toggleMobileMenu);
  linksList.forEach((elem) => elem.addEventListener('click', toggleMobileMenu));
  headerWrapper.addEventListener('click', (event) => {
    if (event.target === headerWrapper) {
      mobileMenu.classList.remove('active_menu');
      navMenu.classList.remove('active_menu');
      body.classList.remove('active_menu');
      backgroundMenu.classList.remove('active_menu');
    }
  });
}

export function changeMenuActiveLink(hash:string) {
  const linksList:NodeListOf<HTMLElement> = document.querySelectorAll('.header-nav-link');
  linksList.forEach((link) => {
    link.classList.remove('header-nav-active');
    if (hash === link.hash.slice(1)) link.classList.add('header-nav-active');
  });
}
