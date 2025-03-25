"use strict";

// Data
const accounts = [
  {
    owner: "Jonas Schmedtmann",
    movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
    interestRate: 1.2,
    pin: 1111,
    type: "premium",
  },
  {
    owner: "Jessica Davis",
    movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
    interestRate: 1.5,
    pin: 2222,
    type: "standard",
  },
  {
    owner: "Steven Thomas Williams",
    movements: [200, -200, 340, -300, -20, 50, 400, -460],
    interestRate: 0.7,
    pin: 3333,
    type: "premium",
  },
  {
    owner: "Sarah Smith",
    movements: [430, 1000, 700, 50, 90],
    interestRate: 1,
    pin: 4444,
    type: "basic",
  },
];

// Elements
// labels
const labelWelcome = document.querySelector(".welcome");
const labelBalance = document.querySelector(".balance__value");
const labelSumIn = document.querySelector(".summary__value--in");
const labelSumOut = document.querySelector(".summary__value--out");
const labelSumInterest = document.querySelector(".summary__value--interest");

// containers
const containerMovements = document.querySelector(".movements");

// display movements
const displayMovements = function (movements) {
  movements.forEach((mov, i) => {
    const type = mov > 0 ? "deposit" : "withdrawal";

    const html = `
     <div class="movements__row">
          <div class="movements__type movements__type--${type}">${
      i + 1
    } ${type}</div>
          <div class="movements__date">3 days ago</div>

          <div class="movements__value">${mov}</div>
        </div>
      `;

    containerMovements.insertAdjacentHTML("afterbegin", html);
  });
};

displayMovements(accounts[0].movements);

// display balance
const calcDisplayBalance = function (movements) {
  const balance = movements.reduce((acc, mov) => acc + mov, 0);

  labelBalance.textContent = `${balance} €`;
};

calcDisplayBalance(accounts[0].movements);

// calc display summary
const calcDisplaySummary = function (account) {
  //income
  const incomes = account.movements
    .filter((mov) => mov > 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumIn.textContent = `${incomes}`;

  //outgoing
  const withdrawals = account.movements
    .filter((mov) => mov < 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumOut.textContent = `${Math.abs(withdrawals)}`;

  //interest on deposits
  const interest = (account.interestRate * incomes) / 100;
  labelSumInterest.textContent = `${interest}`;
};
calcDisplaySummary(accounts[0]);
