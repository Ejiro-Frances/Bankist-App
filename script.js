"use strict";

// Data
const accounts = [
  {
    owner: "Jonas Schmedtmann",
    movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
    interestRate: 1.2,
    pin: 1111,
    type: "premium",

    movementsDates: [
      "2024-08-18T21:31:17.178Z",
      "2024-10-23T07:42:02.383Z",
      "2024-11-28T09:15:04.904Z",
      "2024-12-01T10:17:24.185Z",
      "2025-02-08T14:11:59.604Z",
      "2025-03-25T17:01:17.194Z",
      "2025-03-28T23:36:17.929Z",
      "2025-03-30T10:51:36.790Z",
    ],
    currency: "EUR",
    locale: "pt-PT", // de-DE
  },
  {
    owner: "Jessica Davis",
    movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
    interestRate: 1.5,
    pin: 2222,
    type: "standard",

    movementsDates: [
      "2014-09-01T13:15:33.035Z",
      "2014-10-30T09:48:16.867Z",
      "2014-12-25T06:04:23.907Z",
      "2025-01-25T14:18:46.235Z",
      "2025-02-05T16:33:06.386Z",
      "2025-02-10T14:43:26.374Z",
      "2025-03-25T18:49:59.371Z",
      "2025-03-26T12:01:20.894Z",
    ],
    currency: "USD",
    locale: "en-US",
  },
  {
    owner: "Steven Thomas Williams",
    movements: [200, -200, 340, -300, -20, 50, 400, -460],
    interestRate: 0.7,
    pin: 3333,
    type: "premium",

    movementsDates: [
      "2019-11-18T21:31:17.178Z",
      "2019-12-23T07:42:02.383Z",
      "2020-01-28T09:15:04.904Z",
      "2020-04-01T10:17:24.185Z",
      "2020-05-08T14:11:59.604Z",
      "2020-05-27T17:01:17.194Z",
      "2020-07-11T23:36:17.929Z",
      "2020-07-12T10:51:36.790Z",
    ],
    currency: "EUR",
    locale: "pt-PT", // de-DE
  },
  {
    owner: "Sarah Smith",
    movements: [430, 1000, 700, 50, 90],
    interestRate: 1,
    pin: 4444,
    type: "basic",

    movementsDates: [
      "2019-11-01T13:15:33.035Z",
      "2020-01-25T14:18:46.235Z",
      "2020-04-10T14:43:26.374Z",
      "2020-06-25T18:49:59.371Z",
      "2020-07-26T12:01:20.894Z",
    ],
    currency: "USD",
    locale: "en-US",
  },
];

// Elements
// labels
const labelWelcome = document.querySelector(".welcome");
const labelDate = document.querySelector(".date");
const labelBalance = document.querySelector(".balance__value");
const labelSumIn = document.querySelector(".summary__value--in");
const labelSumOut = document.querySelector(".summary__value--out");
const labelSumInterest = document.querySelector(".summary__value--interest");
const labelTimer = document.querySelector(".timer");

// containers
const containerApp = document.querySelector(".app");
const containerMovements = document.querySelector(".movements");

//btns
const btnLogin = document.querySelector(".login__btn");
const btnTransfer = document.querySelector(".form__btn--transfer");
const btnLoan = document.querySelector(".form__btn--loan");
const btnClose = document.querySelector(".form__btn--close");
const btnSort = document.querySelector(".btn--sort");

// input fields
const inputLoginUsername = document.querySelector(".login__input--user");
const inputLoginPin = document.querySelector(".login__input--pin");
const inputTransferTo = document.querySelector(".form__input--to");
const inputTransferAmount = document.querySelector(".form__input--amount");
const inputLoanAmount = document.querySelector(".form__input--loan-amount");
const inputCloseUsername = document.querySelector(".form__input--user");
const inputClosePin = document.querySelector(".form__input--pin");

//Functions
// create Time
const formatMovementDate = function (date, locale) {
  const calcDaysPassed = (date1, date2) =>
    Math.round(Math.abs(date2 - date1) / (1000 * 60 * 60 * 24));

  const daysPassed = calcDaysPassed(new Date(), date);

  if (daysPassed === 0) return "Today";
  if (daysPassed === 1) return "Yesterday";
  if (daysPassed <= 7) return `${daysPassed} days ago`;
  else {
    // const day = `${date.getDate()}`.padStart(2, 0);
    // const month = `${date.getMonth() + 1}`;
    // const year = date.getFullYear();
    //return `${day}/${month}/${year}`;
    return new Intl.DateTimeFormat(locale).format(date);
  }
};

//format currency
const formatCur = function (value, locale, currency) {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency: currency,
  }).format(value);
};

// display movements
const displayMovements = function (acc, sort = false) {
  containerMovements.innerHTML = "";

  const combinedMovsDates = acc.movements.map((mov, i) => ({
    movement: mov,
    movementDate: acc.movementsDates.at(i),
  }));

  if (sort) combinedMovsDates.sort((a, b) => a.movement - b.movement);

  combinedMovsDates.forEach((obj, i) => {
    const { movement, movementDate } = obj;
    const type = movement > 0 ? "deposit" : "withdrawal";

    //since i alreaddy looped through the array an got the index, i can use the index for the dates

    //create current date
    const date = new Date(movementDate);

    const displayDate = formatMovementDate(date, acc.locale);

    //format the display currency
    const formattedMov = formatCur(movement, acc.locale, acc.currency);

    const html = `
     <div class="movements__row">
        <div class="movements__type movements__type--${type}">${
      i + 1
    } ${type}</div>
          <div class="movements__date">${displayDate}</div>
          <div class="movements__value"> ${formattedMov}</div>
     </div>
      `;

    containerMovements.insertAdjacentHTML("afterbegin", html);
  });
};

// display balance
const calcDisplayBalance = function (acc) {
  //calc balance and store it in the acc object
  acc.balance = acc.movements.reduce((acc, mov) => acc + mov, 0);

  labelBalance.textContent = formatCur(acc.balance, acc.locale, acc.currency);

  // labelBalance.textContent = `${acc.balance.toFixed(2)} €`;
};

// calc display summary
const calcDisplaySummary = function (account) {
  //income
  const incomes = account.movements
    .filter((mov) => mov > 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumIn.textContent = formatCur(incomes, account.locale, account.currency);

  //outgoing
  const withdrawals = account.movements
    .filter((mov) => mov < 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumOut.textContent = formatCur(
    Math.abs(withdrawals),
    account.locale,
    account.currency
  );

  //interest on deposits
  const interest = account.movements
    .filter((mov) => mov > 0)
    .map((deposit) => (deposit * account.interestRate) / 100)
    .filter((int, i, arr) => {
      return int >= 1;
    })
    .reduce((acc, int) => acc + int, 0);

  labelSumInterest.textContent = formatCur(
    interest,
    account.locale,
    account.currency
  );
};

// create usernames
const createUsernames = function (accs) {
  accs.forEach((acc) => {
    acc.username = acc.owner
      .toLowerCase()
      .split(" ")
      .map((name) => name[0])
      .join("");
  });
};

createUsernames(accounts);

//update UI
const updateUI = function (acc) {
  //display movements
  displayMovements(acc);

  // display balance
  calcDisplayBalance(acc);

  // display summary
  calcDisplaySummary(acc);
};

const startLogOutTimer = function () {
  const tick = function () {
    const min = String(Math.trunc(time / 60)).padStart(2, 0);
    const sec = time % 60;

    // in each call, print the remaining time to UI
    labelTimer.textContent = `${min}:${sec}`;

    // when 0 seconds, stop timer and log out user
    if (time === 0) {
      clearInterval(timer);

      //log the user out: i.e hide the UI and reset welcome message
      labelWelcome.textContent = "Log in to get started";
      containerApp.style.opacity = 0;
    }

    //decrease 1s
    time--;
  };

  //set time to 5 minutes
  let time = 360;

  //call the timer immediately
  tick();

  // Call the timer every second
  const timer = setInterval(tick, 1000);

  return timer;
};

//////////////////////////////////////////////
// Event handlers

let currentAccount, timer;
//fake login
// currentAccount = accounts[0];
// updateUI(currentAccount);
// containerApp.style.opacity = 1;
///////////

//login
btnLogin.addEventListener("click", (e) => {
  e.preventDefault();

  currentAccount = accounts.find(
    (acc) => acc.username === inputLoginUsername.value
  );

  if (currentAccount?.pin === +inputLoginPin.value) {
    //display UI
    labelWelcome.textContent = `Welcome back ${
      currentAccount.owner.split(" ")[0]
    }`;

    containerApp.style.opacity = 1;

    //create current date
    // const now = new Date();
    // const day = `${now.getDate()}`.padStart(2, 0);
    // const month = `${now.getMonth() + 1}`;
    // const year = now.getFullYear();
    // const hour = `${now.getHours()}`.padStart(2, 0);
    // const minutes = `${now.getMinutes()}`.padStart(2, 0);
    //labelDate.textContent = `${day}/${month}/${year}, ${hour}:${minutes}`;
    // create international date
    const now = new Date();
    const options = {
      hour: "numeric",
      minute: "numeric",
      day: "numeric",
      month: "numeric",
      year: "numeric",
      //weekday: "long",
    };

    //getting the users locale from their browser
    //const locale = navigator.language;

    //using the locale from the object
    labelDate.textContent = new Intl.DateTimeFormat(
      currentAccount.locale,
      options
    ).format(now);

    // clear input fields
    inputLoginUsername.value = inputLoginPin.value = "";
    inputLoginPin.blur();

    //if there is a time running, clear it
    if (timer) clearInterval(timer);

    //set timer
    timer = startLogOutTimer();

    // update UI
    updateUI(currentAccount);
  }
});

// Operations : Transfer
btnTransfer.addEventListener("click", (e) => {
  e.preventDefault();

  const receiverAcc = accounts.find(
    (acc) => acc.username === inputTransferTo.value
  );
  const amount = +inputTransferAmount.value;

  //clear input fields
  inputTransferTo.value = inputTransferAmount.value = "";
  inputTransferAmount.blur();

  if (
    amount > 0 &&
    receiverAcc &&
    currentAccount.balance >= amount &&
    receiverAcc?.username !== currentAccount.username
  ) {
    //add the amount transferred as a negative number to the current acc array of movements and as a positive value tot the reciever's movement array
    currentAccount.movements.push(-amount);
    receiverAcc.movements.push(amount);

    //Add transfer dates
    currentAccount.movementsDates.push(new Date().toISOString());
    receiverAcc.movementsDates.push(new Date().toISOString());
    updateUI(currentAccount);

    //Reset timer
    clearInterval(timer);
    //override the timer
    timer = startLogOutTimer();
  }
});

//operation:loan amount
btnLoan.addEventListener("click", (e) => {
  e.preventDefault();

  const loanAmount = Math.floor(inputLoanAmount.value);
  //for deposits greater than 10%
  if (
    loanAmount > 0 &&
    currentAccount.movements.some((mov) => mov >= loanAmount * 0.1)
  ) {
    setTimeout(function () {
      //Add movement
      currentAccount.movements.push(loanAmount);

      //Add loan dates
      currentAccount.movementsDates.push(new Date().toISOString());

      updateUI(currentAccount);
    }, 2500);
  }

  inputLoanAmount.value = "";
  inputLoanAmount.blur();

  //Reset timer
  clearInterval(timer);
  //override the timer
  timer = startLogOutTimer();
});

//operation: close account
btnClose.addEventListener("click", (e) => {
  e.preventDefault();

  if (
    inputCloseUsername.value === currentAccount.username &&
    +inputClosePin.value === currentAccount.pin
  ) {
    const index = accounts.findIndex(
      (acc) => acc.username === currentAccount.username
    );
    //delete the user
    accounts.splice(index, 1);

    //log the user out: i.e hide the UI
    containerApp.style.opacity = 0;
  }
  inputCloseUsername.value = inputClosePin.value = "";
  inputClosePin.blur();
});

// sort
let sorted = false;
btnSort.addEventListener("click", (e) => {
  e.preventDefault();
  displayMovements(currentAccount, !sorted);
  sorted = !sorted;
});
