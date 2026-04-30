const transactionForm = document.getElementById("transactionForm");
const goalForm = document.getElementById("goalForm");
const transactionList = document.getElementById("transactionList");
const clearAllBtn = document.getElementById("clearAllBtn");
const recentTransactions = document.getElementById("recentTransactions");

const totalIncome = document.getElementById("totalIncome");
const totalExpense = document.getElementById("totalExpense");
const balance = document.getElementById("balance");

const totalSpent = document.getElementById("totalSpent");
const savedTotal = document.getElementById("savedTotal");
const spendingCategories = document.getElementById("spendingCategories");

const savedGoalName = document.getElementById("savedGoalName");
const savedGoalAmount = document.getElementById("savedGoalAmount");
const savedMoney = document.getElementById("savedMoney");
const progressFill = document.getElementById("progressFill");

let transactions = JSON.parse(localStorage.getItem("transactions")) || [];
let goal = JSON.parse(localStorage.getItem("goal")) || null;

function saveTransactions() {
  localStorage.setItem("transactions", JSON.stringify(transactions));
}

function saveGoal() {
  localStorage.setItem("goal", JSON.stringify(goal));
}

function calculateSummary() {
  let income = 0;
  let expense = 0;

  transactions.forEach((transaction) => {
    if (transaction.type === "income") {
      income += transaction.amount;
    } else if (transaction.type === "expense") {
      expense += transaction.amount;
    }
  });

  const currentBalance = income - expense;

  if (totalIncome) {
    totalIncome.textContent = `${income} TL`;
  }

  if (totalExpense) {
    totalExpense.textContent = `${expense} TL`;
  }

  if (balance) {
    balance.textContent = `${currentBalance} TL`;
  }

  updateGoalProgress(currentBalance);
  updateSaving(currentBalance);
  updateSpending();
}

function renderTransactions() {
  if (!transactionList) return;

  transactionList.innerHTML = "";

  if (transactions.length === 0) {
    transactionList.innerHTML = `
      <li class="empty-state">
        No transactions yet. Start by adding your first income or expense.
      </li>
    `;
    return;
  }

  transactions.forEach((transaction, index) => {
    const li = document.createElement("li");

    li.innerHTML = `
      <div class="transaction-info">
        <strong>${transaction.description}</strong>
        <div class="transaction-meta">
          ${transaction.category} • ${transaction.date} • ${transaction.type}
        </div>
      </div>

      <div class="amount-box ${transaction.type}">
        ${transaction.type === "income" ? "+" : "-"}${transaction.amount} TL
      </div>

      <button class="delete-btn" onclick="deleteTransaction(${index})">Delete</button>
    `;

    transactionList.appendChild(li);
  });
}

function renderRecentTransactions() {
  if (!recentTransactions) return;

  recentTransactions.innerHTML = "";

  if (transactions.length === 0) {
    recentTransactions.innerHTML = `<li>No recent transactions yet.</li>`;
    return;
  }

  const latestTransactions = transactions.slice(-3).reverse();

  latestTransactions.forEach((transaction) => {
    const li = document.createElement("li");

    li.innerHTML = `
      <strong>${transaction.description}</strong><br>
      ${transaction.category} • ${transaction.date} • 
      ${transaction.type === "income" ? "+" : "-"}${transaction.amount} TL
    `;

    recentTransactions.appendChild(li);
  });
}

function deleteTransaction(index) {
  transactions.splice(index, 1);
  saveTransactions();
  renderTransactions();
  renderRecentTransactions();
  calculateSummary();
}

function updateSpending() {
  if (!totalSpent && !spendingCategories) return;

  let spent = 0;
  let categoryMap = {};

  transactions.forEach((transaction) => {
    if (transaction.type === "expense") {
      spent += transaction.amount;

      if (!categoryMap[transaction.category]) {
        categoryMap[transaction.category] = 0;
      }

      categoryMap[transaction.category] += transaction.amount;
    }
  });

  if (totalSpent) {
    totalSpent.textContent = `${spent} TL`;
  }

  if (!spendingCategories) return;

  spendingCategories.innerHTML = "";

  if (spent === 0) {
    spendingCategories.innerHTML = `<li>No spending data yet.</li>`;
    return;
  }

  for (let category in categoryMap) {
    const li = document.createElement("li");
    li.textContent = `${category}: ${categoryMap[category]} TL`;
    spendingCategories.appendChild(li);
  }
}

function updateSaving(currentBalance) {
  if (!savedTotal) return;

  const saved = currentBalance > 0 ? currentBalance : 0;
  savedTotal.textContent = `${saved} TL`;
}

function displayGoal() {
  if (!savedGoalName || !savedGoalAmount || !savedMoney || !progressFill) return;

  if (!goal) {
    savedGoalName.textContent = "No Goal Set";
    savedGoalAmount.textContent = "0";
    savedMoney.textContent = "0";
    progressFill.style.width = "0%";
    return;
  }

  savedGoalName.textContent = goal.name;
  savedGoalAmount.textContent = goal.amount;
}

function updateGoalProgress(currentBalance) {
  if (!savedMoney || !progressFill) return;

  if (!goal || goal.amount <= 0) {
    savedMoney.textContent = "0";
    progressFill.style.width = "0%";
    return;
  }

  const saved = currentBalance > 0 ? currentBalance : 0;
  const progress = Math.min((saved / goal.amount) * 100, 100);

  savedMoney.textContent = saved;
  progressFill.style.width = `${progress}%`;
}

if (transactionForm) {
  transactionForm.addEventListener("submit", function (e) {
    e.preventDefault();

    const description = document.getElementById("description").value.trim();
    const amount = Number(document.getElementById("amount").value);
    const type = document.getElementById("type").value;
    const category = document.getElementById("category").value;
    const date = document.getElementById("date").value;

    if (!description || amount <= 0 || !type || !category || !date) {
      alert("Please fill all fields correctly.");
      return;
    }

    const newTransaction = {
      description: description,
      amount: amount,
      type: type,
      category: category,
      date: date
    };

    transactions.push(newTransaction);
    saveTransactions();
    renderTransactions();
    renderRecentTransactions();
    calculateSummary();
    transactionForm.reset();

    alert("Transaction added successfully!");
  });
}

if (goalForm) {
  goalForm.addEventListener("submit", function (e) {
    e.preventDefault();

    const goalName = document.getElementById("goalName").value.trim();
    const goalAmount = Number(document.getElementById("goalAmount").value);

    if (!goalName || goalAmount <= 0) {
      alert("Please enter a valid goal name and amount.");
      return;
    }

    goal = {
      name: goalName,
      amount: goalAmount
    };

    saveGoal();
    displayGoal();
    calculateSummary();
    goalForm.reset();

    alert("Goal saved successfully!");
  });
}

if (clearAllBtn) {
  clearAllBtn.addEventListener("click", function () {
    const confirmClear = confirm("Are you sure you want to delete all transactions?");

    if (!confirmClear) return;

    transactions = [];
    saveTransactions();
    renderTransactions();
    renderRecentTransactions();
    calculateSummary();
  });
}

renderTransactions();
renderRecentTransactions();
displayGoal();
calculateSummary();