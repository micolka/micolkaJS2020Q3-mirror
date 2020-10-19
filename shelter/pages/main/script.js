import {petsData} from "../data.js";

const mobileMenu = document.querySelector('.header-mobile-menu');
const navMenu = document.querySelector('.header-nav-menu');
const body = document.querySelector('body');
const backgroundMenu = document.querySelector('.header-menu-background');
const activeLink = document.querySelector('.header-nav-active');

const toggleMobileMenu = function() {
  mobileMenu.classList.toggle('active');
  navMenu.classList.toggle('active');
  body.classList.toggle('active');
  backgroundMenu.classList.toggle('active');
}

mobileMenu.addEventListener('click', toggleMobileMenu);
backgroundMenu.addEventListener('click', toggleMobileMenu);
activeLink.addEventListener('click', toggleMobileMenu);


// Pets carousel implementation
let carousel = function () {
  let items = document.querySelectorAll('.pets-card-wrapper');
  let currentItem = 0;
  let isEnabled = true;

  function changeCurrentItem(n) {
    currentItem = (n + items.length) % items.length;
  }

  function hideItem(direction) {
    isEnabled = false;
    items[currentItem].classList.add(direction);
    items[currentItem].addEventListener('animationend', function() {
      this.classList.remove('active', direction);
    });
  }

  function showItem(direction) {
    items[currentItem].classList.add('next', direction);
    items[currentItem].addEventListener('animationend', function() {
      this.classList.remove('next', direction);
      this.classList.add('active');
      isEnabled = true;
    });
  }

  function previousItem(n) {
    hideItem('to-right');
    changeCurrentItem(n - 1);
    showItem('from-left');
  }

  function nextItem(n) {
    hideItem('to-left');
    changeCurrentItem(n + 1);
    showItem('from-right');
  }

  document.querySelector('.btn-arr-left').addEventListener('click', function() {
    if (isEnabled) {
      previousItem(currentItem);
    }
  });

  document.querySelector('.btn-arr-right').addEventListener('click', function() {
    if (isEnabled) {
      nextItem(currentItem);
    }
  });

}

carousel();