const mobileMenu = document.querySelector('.header-mobile-menu');
const navMenu = document.querySelector('.header-nav-menu');
const body = document.querySelector('body');
const backgroundMenu = document.querySelector('.header-menu-background');
const activeLink = document.querySelector('.header-nav-active');
const logo = document.querySelector('.header-logo');

const toggleMobileMenu = function() {
  mobileMenu.classList.toggle('active');
  navMenu.classList.toggle('active');
  body.classList.toggle('active');
  backgroundMenu.classList.toggle('active');
  logo.classList.toggle('active');
}

mobileMenu.addEventListener('click', toggleMobileMenu);
backgroundMenu.addEventListener('click', toggleMobileMenu);
activeLink.addEventListener('click', toggleMobileMenu);