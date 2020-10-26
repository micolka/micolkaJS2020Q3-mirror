import {petsData} from "../data.js";

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


function initFriendsData() {
  let currentPage = 1;
  let numberOfFriends = getFriendCountPerPage();
  let petsDataId = generateFriendsIds(numberOfFriends);
  const petsCardArr = document.querySelectorAll('.pets-card');
  const btnStart = document.querySelector('[data-start]');
  const btnLeft = document.querySelector('[data-left]');
  const btnCounter = document.querySelector('[data-counter]');
  const btnRight = document.querySelector('[data-right]');
  const btnEnd = document.querySelector('[data-end]');
  const petsWrapper = document.querySelector('.pets-card-wrapper');

  btnStart.addEventListener('click', () => {
    petsWrapper.classList.add('active')
      setTimeout( () => {
      currentPage = 1;
      fillFriendsCarts();
      btnStart.disabled = true;
      btnLeft.disabled = true;
      btnRight.disabled = false;
      btnEnd.disabled = false;
      btnCounter.innerHTML = `<h4>${currentPage}</h4>`;
      petsWrapper.classList.remove('active');
    }, 300)  
  });

  btnLeft.addEventListener('click', () => {
    petsWrapper.classList.add('active')
      setTimeout( () => {
      if (currentPage !== 1) currentPage--;
      fillFriendsCarts();
      btnRight.disabled = false;
      btnEnd.disabled = false;
      btnCounter.innerHTML = `<h4>${currentPage}</h4>`

      if (currentPage === 1) {
        btnStart.disabled = true;
        btnLeft.disabled = true;
      }
      petsWrapper.classList.remove('active');
    }, 300)  
  });

  btnRight.addEventListener('click', () => {
    petsWrapper.classList.add('active')
      setTimeout( () => {    
      if (currentPage !== 48 / numberOfFriends) currentPage++;
      fillFriendsCarts();
      btnStart.disabled = false;
      btnLeft.disabled = false;
      btnCounter.innerHTML = `<h4>${currentPage}</h4>`

      if (currentPage === 48 / numberOfFriends) {
        btnRight.disabled = true;
        btnEnd.disabled = true;
      }
      petsWrapper.classList.remove('active');
    }, 300)  
  });

  btnEnd.addEventListener('click', () => {
    petsWrapper.classList.add('active')
    setTimeout( () => { 
      currentPage = 48 / numberOfFriends;
      fillFriendsCarts();
      btnStart.disabled = false;
      btnLeft.disabled = false;
      btnRight.disabled = true;
      btnEnd.disabled = true;
      btnCounter.innerHTML = `<h4>${currentPage}</h4>`;
      petsWrapper.classList.remove('active');
    }, 300)  
  });

  function getFriendCountPerPage() {
    const  windowWidth = window.innerWidth;
    let count;
    if (windowWidth > 1279) {
       count = 8;
    } else if (windowWidth > 767) {
       count = 6;
    } else count = 3;
    return count;
  }

  function generateFriendsIds(n) {
    let out = []
    let arr = []
    for( let i = 0; i < 48 / n; i++) {
      arr = [0,1,2,3,4,5,6,7];
      let m = 8
      for( let j = n; j > 0; j--) {
        let indx = Math.floor(Math.random() * m);
        out.push(arr[indx]);
        arr.splice(indx, 1);
        m--;
      }
    }
    return out;
  }

  function fillFriendsCarts() {
    let j = 0;
    for (let i = 0 + (currentPage - 1) * numberOfFriends; i < currentPage * numberOfFriends; i++) {
      let index = petsDataId[i];
      petsCardArr[j].children[0].src = petsData[index].img;
      petsCardArr[j].children[1].textContent = petsData[index].name;
      petsCardArr[j].id = index;
      j++;
    }
  }

  window.addEventListener(`resize`, () => {
    let friendsCount =  getFriendCountPerPage()
    if (friendsCount !== numberOfFriends) {
      numberOfFriends = friendsCount;
      petsDataId = generateFriendsIds(friendsCount);
      fillFriendsCarts();
      currentPage = 1;
      btnStart.disabled = true;
      btnLeft.disabled = true;
      btnRight.disabled = false;
      btnEnd.disabled = false;
      btnCounter.innerHTML = `<h4>${currentPage}</h4>`
    }
  });

  fillFriendsCarts();
}

function initModalWindow() {
  const petsCards = document.querySelectorAll('.pets-card')
  const closeModalButton = document.querySelector('[data-close-button]')
  const overlay = document.getElementById('page-overlay')
  const modal = document.querySelector('.pets-modal')
  const modalContent = document.querySelector('.modal-body-content')
  const modalImg = document.querySelector('.modal-body img')

  petsCards.forEach(el => {
    el.addEventListener('click', (e) => { 
      setModalData(e.currentTarget) 
      openModal()
      body.classList.toggle('active');
    })
  })

  closeModalButton.addEventListener('click', () => {
      closeModal()
      body.classList.toggle('active');
  })
  closeModalButton.addEventListener('mouseover', () => {
    closeModalButton.style.background = '#FDDCC4'
  })

  overlay.addEventListener('click', () => {
      closeModal()
      body.classList.toggle('active');
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

initFriendsData()
initModalWindow()