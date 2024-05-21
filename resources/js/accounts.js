// Data
const account1 = {
	owner: "Jonas Schmedtmann",
	movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
	movements: [200, 455.23, -306.5, 25000, -642.21, -133.9, 79.97, 1300],
	interestRate: 1.2, // %
	pin: 1111,
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
};

const account2 = {
	owner: "Jessica Davis",
	movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],

	interestRate: 1.5,
	pin: 2222,
	movementsDates: [
		"2019-11-01T13:15:33.035Z",
		"2019-11-30T09:48:16.867Z",
		"2019-12-25T06:04:23.907Z",
		"2020-01-25T14:18:46.235Z",
		"2020-02-05T16:33:06.386Z",
		"2020-04-10T14:43:26.374Z",
		"2020-06-25T18:49:59.371Z",
		"2020-07-26T12:01:20.894Z",
	],
	currency: "INR",
	locale: "en-IN",
};

const account3 = {
	owner: "Steven Thomas Williams",
	movements: [200, -200, 340, -300, -20, 50, 400, -460],
	interestRate: 0.7,
	pin: 3333,
};

const account4 = {
	owner: "Sarah Smith",
	movements: [430, 1000, 700, 50, 90],
	interestRate: 1,
	pin: 4444,
};

const account5 = {
	owner: "Abhishek Kembalikar",
	movements: [1900, 2000, -919, -80, 20, -90, 9000, -1000, 9000],
	interestRate: 2.6,
	pin: 2244,
	movementsDates: [
		"2019-11-01T13:15:33.035Z",
		"2019-11-30T09:48:16.867Z",
		"2020-01-25T14:18:46.235Z",
		"2020-12-25T06:04:23.907Z",
		"2024-01-14T16:33:06.386Z",
		"2024-01-16T14:43:26.374Z",
		"2024-01-18T18:49:59.371Z",
		"2024-01-21T12:01:20.894Z",
		"2024-05-20T08:58:07.172Z",
	],
	currency: "USD",
	locale: "en-IN",
};

///////////////////////////////////////////////////////////////////////////////
const accounts = [account1, account2, account3, account4, account5];
const createUserName = function (accsArr) {
	accsArr.forEach((name) => {
		name.username = name.owner
			.toLowerCase()
			.split(" ")
			.map((nameFL) => nameFL[0])
			.join("");
	});
	// console.log(...accounts);
};
createUserName(accounts);

export { accounts, createUserName };

console.log("All Accounts : ", accounts);
