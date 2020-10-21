const time = document.getElementById('time')
const greeting = document.getElementById('greeting')
const name = document.getElementById('name')
const goal = document.getElementById('focus')
const changeBG = document.getElementById('change-bg')
let backgroundList = []
let currentBGIndx = 0
let currentHour = 0

function updateClockFace() {
  let now = new Date()
  let hour = now.getHours()
  let min = now.getMinutes()
  let sec = now.getSeconds()
  let date = now.getDate()
  let day = now.getDay()
  let month = now.getMonth()
  time.innerHTML = `${hour}:${addZero(min)}:${addZero(sec)} ${getDayOfWeek(day)}</br> ${date} ${getCurrentMonth(month)}`

  if (currentHour !== hour) {
    currentHour = hour
    setBgGreetMessage()
  }

  setTimeout(updateClockFace, 1000)
}

function addZero(n) {
  return n < 10 ? `0${n}` : n
}

function getDayOfWeek(day) {
  switch (day) {
    case 0: return 'Sunday'
    case 1: return 'Monday'
    case 2: return 'Tuesday'
    case 3: return 'Wednesday'
    case 4: return 'Thursday'
    case 5: return 'Friday'
    case 6: return 'Saturday'
  }
}

function getCurrentMonth(month) {
  switch (month) {
    case 0: return 'January'
    case 1: return 'February'
    case 2: return 'March'
    case 3: return 'April'
    case 4: return 'May'
    case 5: return 'June'
    case 6: return 'July'
    case 7: return 'August'
    case 8: return 'September'
    case 9: return 'October'
    case 10: return 'November'
    case 11: return 'December'
  }
}

function setBgGreetMessage() {
  let hour = new Date().getHours()
  let dayPart = ''
  if (hour < 6) {
    dayPart = 'night'
    greeting.textContent = 'Good Night,'
  } else if (hour < 12) {
    dayPart = 'morning'
    greeting.textContent = 'Good Morning,'
  } else if (hour < 18) {
    dayPart = 'day'
    greeting.textContent = 'Good Day,'
  } else if (hour < 24) {
    dayPart = 'evening'
    greeting.textContent = 'Good Evening,'
  }
  currentBGIndx = hour
  document.body.style.backgroundImage = `url('./assets/images/${dayPart}/${backgroundList[hour]}.jpg')`
}

function generateBackgroundList() {
  for (let i = 0; i < 24; i++) {
    backgroundList[i] = Math.floor(Math.random() * 20 + 1);
    backgroundList[i] = backgroundList[i] < 10 ? `0${backgroundList[i]}` : backgroundList[i]
  }
}

function forceChangeBG() {
  currentBGIndx++
  if(currentBGIndx > 23) currentBGIndx = 0
  let dayPart = ''
  if (currentBGIndx < 6) {
    dayPart = 'night'
  } else if (currentBGIndx < 12) {
    dayPart = 'morning'
  } else if (currentBGIndx < 18) {
    dayPart = 'day'
  } else if (currentBGIndx < 24) {
    dayPart = 'evening'
  }
  document.body.style.backgroundImage = `url('./assets/images/${dayPart}/${backgroundList[currentBGIndx]}.jpg')`
}

function getName() {
  if(localStorage.getItem('name') === null) {
    name.textContent = '[What is your name?]'
  } else {
    name.textContent = localStorage.getItem('name')
  }
}

function setName(event) {
  if (event.type === 'keypress' && event.keyCode !== 13) {
    return
  } else {
    name.blur()
  }
  if (event.target.innerText === '') {
    getName()
    return
  }
  localStorage.setItem('name', event.target.innerText)
}

function getGoal() {
  if(localStorage.getItem('goal') === null) {
    goal.value = '[Enter your goal]'
  } else {
    goal.value = localStorage.getItem('goal')
  }
}

function setGoal(event) {
  if (event.type === 'keypress' && event.keyCode !== 13) {
    return
  } else {
    goal.blur()
  }
  if (event.target.value === '') {
    getGoal()
    return
  }
  localStorage.setItem('goal', event.target.value)
}

function clearName(event){
  event.target.innerText = ''
}
function clearInput(event){
  event.target.value = ''
}

async function getQuote() {
  const url = `https://cors-anywhere.herokuapp.com/https://api.forismatic.com/api/1.0/?method=getQuote&format=json&lang=en`;
  const res = await fetch(url);
  const data = await res.json(); 
  console.log(data);
}
getQuote()

name.addEventListener('keypress', setName)
name.addEventListener('blur', setName)
name.addEventListener('focus', clearInput)
goal.addEventListener('keypress', setGoal)
goal.addEventListener('blur', setGoal)
goal.addEventListener('focus', clearInput)
changeBG.addEventListener('click', forceChangeBG)

generateBackgroundList()
updateClockFace()
setBgGreetMessage()
getName()
getGoal()
