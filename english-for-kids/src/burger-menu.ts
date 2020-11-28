function initBurgerMenu() {
  const mobileMenu = document.querySelector('.header-mobile-menu');
  const navMenu = document.querySelector('.header-nav-menu');
  const body = document.querySelector('body');
  const backgroundMenu = document.querySelector('.header-menu-background');
  const activeLink = document.querySelector('.header-nav-active');

  const toggleMobileMenu = () => {
    mobileMenu.classList.toggle('active_menu');
    navMenu.classList.toggle('active_menu');
    body.classList.toggle('active_menu');
    backgroundMenu.classList.toggle('active_menu');
  };

  mobileMenu.addEventListener('click', toggleMobileMenu);
  backgroundMenu.addEventListener('click', toggleMobileMenu);
  activeLink.addEventListener('click', toggleMobileMenu);
}

export default initBurgerMenu;
