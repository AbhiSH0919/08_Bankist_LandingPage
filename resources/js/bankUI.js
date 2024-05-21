"use strict";

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

import { accounts, createUserName } from "./accounts.js";

//
const topNavigation = document.querySelector(".topNavigation");
const labelWelcome = document.querySelector(".welcome");
const labelDate = document.querySelector(".date");
const labelBalance = document.querySelector(".balance__value");
const labelSumIn = document.querySelector(".summary__value--in");
const labelSumOut = document.querySelector(".summary__value--out");
const labelSumInterest = document.querySelector(".summary__value--interest");
const labelTimer = document.querySelector(".timer");

const containerApp = document.querySelector(".app");
const containerMovements = document.querySelector(".movements");

const btnLogin = document.querySelector(".login__btn");
const btnTransfer = document.querySelector(".form__btn--transfer");
const btnLoan = document.querySelector(".form__btn--loan");
const btnClose = document.querySelector(".form__btn--close");
const btnSort = document.querySelector(".btn--sort");

const login = document.querySelector(".login");
const inputLoginUsername = document.querySelector(".login__input--user");
const inputLoginPin = document.querySelector(".login__input--pin");
const inputTransferTo = document.querySelector(".form__input--to");
const inputTransferAmount = document.querySelector(".form__input--amount");
const inputLoanAmount = document.querySelector(".form__input--loan-amount");
const inputCloseUsername = document.querySelector(".form__input--user");
const inputClosePin = document.querySelector(".form__input--pin");
let liveTimer;
let timer;

///////////////////////////////////////////////////////////////////////////////

/////////////////////////////////////////////////////////////////////////////////////////
const updateUI = function (acc) {
	printDisplayMovements(acc);

	calcDisplayMovements(acc);

	summaryDisplayMovements.call(acc);

	inputTransferTo.value = inputTransferAmount.value = "";
	inputTransferTo.blur();
	inputTransferAmount.blur();

	inputLoginUsername.value = inputLoginPin.value = "";
	inputLoginUsername.blur();
	inputLoginPin.blur();

	inputLoanAmount.value = "";
	inputLoanAmount.blur();
};

/////////////////////////////////////////////////////////////////////////////////////////
const logOutTimer = function () {
	let time = 560;

	const tick = function () {
		const minutes = String(Math.trunc(time / 60)).padStart(2, 0);
		const seconds = String(Math.trunc(time % 60)).padStart(2, 0);
		labelTimer.textContent = `${minutes}:${seconds}`;

		if (time === 0) {
			clearInterval(timer);
			if (confirm("Do you want to more time for staying logged!")) {
				logOutTimer();
			} else {
				// hide UI and show message
				labelWelcome.textContent = `Log in to get started`;
				containerApp.style.opacity = 0;
			}
		}
		time--;
	};
	tick();
	timer = setInterval(() => tick(), 1000);
};

/////////////////////////////////////////////////////////////////////////////////////////
const updateDateAndTime = function (acc) {
	// create date and time and update in UI
	const dateAndTime = function () {
		//   const now = new Date();
		//   const yyyy = now.getFullYear();
		//   const mm = `${now.getMonth() + 1}`.padStart(2, 0);
		//   const dd = `${now.getDate()}`.padStart(2, 0);
		//   const hr = `${now.getHours() % 12}`.padStart(2, 0);
		//   const min = `${now.getMinutes()}`.padStart(2, 0);
		//   const sec = `${now.getSeconds()}`.padStart(2, 0);
		//   // console.log(now, year, month, date);

		//   labelDate.textContent = `${dd}/${mm}/${yyyy}, ${hr}:${min}:${sec}`;

		const now = new Date();

		const options = {
			year: "numeric",
			month: "2-digit",
			day: "2-digit",
			hour: "2-digit",
			minute: "2-digit",
			second: "2-digit",
			weekday: "long",
		};

		const timeformat = new Intl.DateTimeFormat(acc.locale, options).format(now);

		labelDate.textContent = timeformat;
	};
	dateAndTime();
	liveTimer = setInterval(() => dateAndTime(), 1000);
};

/////////////////////////////////////////////////////////////////////////////////////////
const formatMovementDates = function (date, locale) {
	const calcDaysPassed = (oldDate, newDate) =>
		Math.round(Math.abs(newDate - oldDate) / (1000 * 60 * 60 * 24));

	const daysPassed = calcDaysPassed(date, new Date());

	if (daysPassed === 0) return "Today";
	if (daysPassed === 1) return "Yesterday";
	if (daysPassed <= 7) return `${daysPassed} days ago`;
	else {
		// const day = `${date.getDate()}`.padStart(2, 0);
		// const month = `${date.getMonth() + 1}`.padStart(2, 0);
		// const year = date.getFullYear();
		// return `${day}/${month}/${year}`;

		return new Intl.DateTimeFormat(locale, {
			year: "numeric",
			month: "2-digit",
			day: "2-digit",
		}).format(date);
	}
};

/////////////////////////////////////////////////////////////////////////////////////////
const formatCur = function (value, locale, currency) {
	const options = {
		style: "currency",
		currency: currency,
	};
	return new Intl.NumberFormat(locale, options).format(value);
};

/////////////////////////////////////////////////////////////////////////////////////////
const printDisplayMovements = function (acc, sort = 1) {
	containerMovements.innerHTML = "";
	let movs;
	if (sort === 2) {
		movs = acc.movements.slice().sort((a, b) => a - b);
	} else if (sort === 3) {
		movs = acc.movements.slice().sort((a, b) => b - a);
		sorted = 0;
	} else {
		movs = acc.movements;
	}

	movs.forEach((move, i) => {
		// ===========================================================

		// ===========================================================
		const type = move > 0 ? "deposit" : "withdrawal";
		const date = new Date(acc.movementsDates[i]);
		const displayDate = formatMovementDates(date, acc.locale);
		const formatedMov = formatCur(move, acc.locale, acc.currency);

		const html = `
    <div class="movements__row">
    <div class="movements__type movements__type--${type}">${i + 1} ${type}</div>
    <div class="movements__date">${displayDate}</div>
    <div class="movements__value">${formatedMov}</div>
    </div>
    `;

		containerMovements.insertAdjacentHTML("afterbegin", html);
	});
};
// printDisplayMovements(account1.movements);

/////////////////////////////////////////////////////////////////////////////////////////
const calcDisplayMovements = function (acc) {
	acc.balance = acc.movements.reduce((acc, move) => acc + move, 0);

	labelBalance.textContent = formatCur(acc.balance, acc.locale, acc.currency);
};
// calcDisplayMovements(account1.movements);

/////////////////////////////////////////////////////////////////////////////////////////
const summaryDisplayMovements = function () {
	const income = this.movements
		.filter((diposit) => diposit > 0)
		.reduce((acc, amount) => acc + amount, 0);
	labelSumIn.textContent = formatCur(income, this.locale, this.currency);

	const out = this.movements
		.filter((withdraw) => withdraw < 0)
		.reduce((acc, amount) => acc + amount, 0);
	labelSumOut.textContent = formatCur(
		Math.abs(out),
		this.locale,
		this.currency
	);

	const interest = this.movements
		.filter((diposit) => diposit > 0)
		.map((int, i, arr) => {
			return (int * this.interestRate) / 100;
		})
		.filter((intOn) => intOn >= 1)
		.reduce((acc, amount) => acc + amount, 0);
	labelSumInterest.textContent = formatCur(
		interest,
		this.locale,
		this.currency
	);
};
// summaryDisplayMovements(account1.movements);

// ===========================================================
// inputLoginUsername.value = "ak";
// inputLoginPin.value = 2244;
let currentAccount = accounts[2];
// userName.value = "ak";
// userPin.value = 2244;

btnLogin.addEventListener("click", function (e) {
	e.preventDefault();

	currentAccount = accounts.find(
		(acc) => acc.username === inputLoginUsername.value
	);

	if (currentAccount?.pin === +inputLoginPin.value) {
		// UI and message
		labelWelcome.textContent = `Welcome again, ${
			currentAccount.owner.split(" ")[0]
		}`;
		containerApp.style.opacity = 1;

		// stop log out timer if allredy running & start
		// if (timer) clearInterval(timer);
		// logOutTimer();

		// stop live date and time updating if allredy running & start
		if (liveTimer) clearInterval(liveTimer);
		updateDateAndTime(currentAccount);

		// update UI
		updateUI(currentAccount);

		console.log(currentAccount);
	} else {
		alert("Invalid Details, Please Check Again!");
	}
});

// ===========================================================
btnTransfer.addEventListener("click", function (e) {
	e.preventDefault();

	const amount = +inputTransferAmount.value;
	const receiverAcc = accounts.find(
		(acc) => acc.username === inputTransferTo.value
	);

	if (
		amount > 0 &&
		receiverAcc &&
		currentAccount.balance >= amount &&
		currentAccount.username !== receiverAcc?.username
	) {
		// transfer money openAC to receiverAC
		currentAccount.movements.push(-amount);
		receiverAcc.movements.push(amount);

		// money transfer live date & time add
		currentAccount.movementsDates.push(new Date().toISOString());
		receiverAcc.movementsDates.push(new Date().toISOString());

		// stop log out timer if allredy running & start
		if (timer) clearInterval(timer);
		logOutTimer();

		// update UI
		updateUI(currentAccount);

		console.log(accounts);
	} else {
		alert("Wrong Details, Please Check Again!");
	}
});

// ===========================================================
btnLoan.addEventListener("click", function (e) {
	e.preventDefault();

	const loanAmount = Math.floor(inputLoanAmount.value);

	if (
		loanAmount > 0 &&
		currentAccount.movements.some((move) => move > loanAmount * 0.1)
	) {
		// add amount in current account
		currentAccount.movements.push(loanAmount);

		// add live date or time
		currentAccount.movementsDates.push(new Date().toISOString());

		// stop log out timer if allredy running & start
		if (timer) clearInterval(timer);
		logOutTimer();

		// update UI
		updateUI(currentAccount);
	} else {
		alert("Amount is high!");
	}
});

// ===========================================================
btnClose.addEventListener("click", function (e) {
	e.preventDefault();

	if (
		currentAccount.username === inputCloseUsername.value &&
		currentAccount.pin === +inputClosePin.value
	) {
		const index = accounts.findIndex(
			(acc) => acc.username === inputCloseUsername.value
		);

		accounts.splice(index, 1);
		inputCloseUsername.value = inputClosePin.value = "";
		containerApp.style.opacity = 0;
		labelWelcome.textContent = "Log in to get started";

		// stop log out timer
		clearInterval(timer);

		// stop live date and time updating
		clearInterval(liveTimer);
	} else {
		alert("Wrong Details, Please Check Again!");
	}
});

// ===========================================================
let sorted = 1;
btnSort.addEventListener("click", function (e) {
	e.preventDefault();
	sorted++;
	printDisplayMovements(currentAccount, sorted);
});

// ===========================================================
labelBalance.addEventListener("click", function () {
	const movementsValue = Array.from(
		document.querySelectorAll(".movements__value"),
		(el) => +el.textContent.replace("€", "")
	);

	const movementsValue2 = [
		...document.querySelectorAll(".movements__value"),
	].map((el) => +el.textContent.replace("€", ""));

	console.log(movementsValue, movementsValue2);
});

// // ===========================================================
// // ===========================================================
// // ===========================================================
// // ===========================================================

// /////////////////////////////////////////////////////////

const modal = document.querySelector(".modal");
const overlay = document.querySelector(".overlay");
const signUpModal = modal.querySelector(".signUpModal");
const loginModal = modal.querySelector(".loginModal");
const firstName = modal.querySelector("#fName");
const lastName = modal.querySelector("#lName");
const password = modal.querySelector("#password");
const initialDeposit = modal.querySelector("#initialDeposit");

// /////////////////////////////////////////////////////////

const openModal = function (e) {
	modal.classList.remove("hidden");
	overlay.classList.remove("hidden");
	signUpModal.style.display = "block";
	loginModal.style.display = "none";
};

const closeModal = function () {
	modal.classList.add("hidden");
	overlay.classList.add("hidden");
};

modal.addEventListener("click", function (e) {
	e.preventDefault();

	if (e.target.classList.contains("submit__next-btn")) {
		if (
			firstName.value.length < 1 ||
			lastName.value.length < 1 ||
			+initialDeposit.value < 1000 ||
			password.value.length < 1
		) {
			alert("Please fill the form! \n minimum deposit 1000");
			return;
		} else {
			if (confirm("Continue to open Account!")) {
				const account = {
					owner: firstName.value + " " + lastName.value,
					movements: [],
					interestRate: 2.6,
					pin: +password.value,
					movementsDates: [],
					currency: "INR",
					locale: "en-IN",
				};

				account.movements.push(+initialDeposit.value);
				// add live date or time
				account.movementsDates.push(new Date().toISOString());

				accounts.push(account);
				createUserName(accounts);
				firstName.value =
					lastName.value =
					password.value =
					initialDeposit.value =
						"";
				signUpModal.style.display = "none";
				loginModal.style.display = "block";
			}
		}
	}

	if (e.target.classList.contains("loginModal__link-btn")) {
		signUpModal.style.display = "none";
		loginModal.style.display = "block";
	}

	if (e.target.classList.contains("submit__login-btn")) {
		currentAccount = accounts.find(
			(acc) => acc.username === userName.value && acc.pin === +userPin.value
		);

		if (currentAccount?.pin === +userPin.value) {
			// UI and message
			labelWelcome.textContent = `Welcome again, ${
				currentAccount.owner.split(" ")[0]
			}`;
			closeModal();
			containerApp.style.opacity = 1;
			topNavigation.style.opacity = 1;

			// stop live date and time updating if allredy running & start
			if (liveTimer) clearInterval(liveTimer);
			updateDateAndTime(currentAccount);

			// update UI
			updateUI(currentAccount);

			console.log(currentAccount);
		} else {
			alert("Invalid Details, Please Check Again!");
		}
	}

	if (e.target.classList.contains("signUpModal__link-btn")) openModal();
});
