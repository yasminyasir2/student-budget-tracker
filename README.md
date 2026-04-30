# Student Budget Tracker

Student Budget Tracker is a simple web-based finance management project designed to help students manage their income, expenses, savings, and financial goals.

The project was created using HTML, CSS, and JavaScript. It does not use a database. Instead, it stores user data in the browser using Local Storage.

## Features

- Dashboard overview
- Add income and expense transactions
- View transaction history
- Delete individual transactions
- Clear all transactions
- View total income, total expenses, and balance
- See spending overview by category
- View saved money
- Set a savings goal
- Track goal progress with a progress bar
- Data persistence using Local Storage
- Multi-page navigation

## Pages

The project is divided into separate pages to make the interface cleaner and easier to use.

- `index.html` - Dashboard page
- `add.html` - Add Transaction page
- `transactions.html` - Transaction History page
- `spending.html` - Spending Overview page
- `saving.html` - Saved Money page
- `goal.html` - Savings Goal page

## Technologies Used

- HTML
- CSS
- JavaScript
- Local Storage

## How It Works

The user can add transactions by entering a description, amount, type, category, and date.

If the transaction type is income, it is added to the total income.  
If the transaction type is expense, it is added to the total expenses and spending categories.

The balance is calculated using:

```text
Balance = Total Income - Total Expenses
