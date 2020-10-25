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
    generatePrevCard()
    hideItem('to-right');
    changeCurrentItem(n - 1);
    showItem('from-left');
  }

  function nextItem(n) {
    generateNextCard();
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

let currentPetsIndexes = []
let currentCard = 0;
let petsCardArr = document.querySelectorAll('.pets-card');
// Fills pets cards
function fillPetsInfo() {
  let pseudoIndexes = genPseudoRandom(currentPetsIndexes);
  for (let i = 0; i < 3; i ++) {
    let index = pseudoIndexes[i]
    petsCardArr[i + currentCard].children[0].src = petsData[index].img
    petsCardArr[i + currentCard].children[1].textContent = petsData[index].name
    petsCardArr[i + currentCard].children[2].id = index
    currentPetsIndexes.push(index)
  }
}

function genPseudoRandom(current) {
  let arr = [0,1,2,3,4,5,6,7];
  let out = [];
  for(let i = 8; i > 0; i--) {
    let indx = Math.floor(Math.random() * i);
    out.push(arr[indx]);
    arr.splice(indx, 1);
  }
  if (current.length !== 0) {
    for(let i = 0; i < 3; i++) {
      out.splice(out.indexOf(current[i]), 1);
    }
  }
  currentPetsIndexes = []
  return out;
}

function generateNextCard() {
  currentCard += 3
  if (currentCard > 6) currentCard = 0
  fillPetsInfo(currentPetsIndexes)
}
function generatePrevCard() {
  currentCard -= 3
  if (currentCard < 0) currentCard = 6
  fillPetsInfo(currentPetsIndexes)
}

function initModalWindow() {
  const openModalButtons = document.querySelectorAll('[data-open-button]')
  const closeModalButton = document.querySelector('[data-close-button]')
  const overlay = document.getElementById('page-overlay')
  const modal = document.querySelector('.pets-modal')
  const modalContent = document.querySelector('.modal-body-content')
  const modalImg = document.querySelector('.modal-body img')

  openModalButtons.forEach(button => {
    button.addEventListener('click', () => { 
      setModalData(button) 
      openModal()
    })
  })

  closeModalButton.addEventListener('click', () => {
      closeModal()
  })
  closeModalButton.addEventListener('mouseover', () => {
    closeModalButton.style.background = '#FDDCC4'
  })

  overlay.addEventListener('click', () => {
      closeModal()
  })
  overlay.addEventListener('mouseover', () => {  
    closeModalButton.style.background = '#FDDCC4'
  })
  overlay.addEventListener('mouseleave', () => {
    closeModalButton.style.background = '#F6F6F6'
  })


  function openModal() {
    if (modal === null) return
    modal.classList.add('active')
    overlay.classList.add('active')
  }
  
  function closeModal() {
    if (modal === null) return
    modal.classList.remove('active')
    overlay.classList.remove('active')
  }

  function setModalData(button) {
    let index = button.id
    modalImg.src = petsData[index].img
    modalContent.children[0].textContent = petsData[index].name
    modalContent.children[1].textContent = `${petsData[index].type} - ${petsData[index].breed}`
    modalContent.children[2].textContent = petsData[index].description
    modalContent.children[3].children[0].innerHTML = `<b>Age:</b> ${petsData[index].age}`
    modalContent.children[3].children[1].innerHTML = `<b>Inoculations:</b> ${petsData[index].inoculations.join(', ')}`
    modalContent.children[3].children[2].innerHTML = `<b>Diseases:</b> ${petsData[index].diseases.join(', ')}`
    modalContent.children[3].children[3].innerHTML = `<b>Parasites:</b> ${petsData[index].parasites.join(', ')}`
  }
}

fillPetsInfo();
carousel();
initModalWindow();