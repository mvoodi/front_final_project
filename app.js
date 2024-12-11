const incomeNameInput = document.getElementById("income-name");
const incomeAmountInput = document.getElementById("income-amount");
const incomeCategorySelect = document.getElementById("income-category");
const addIncomeButton = document.getElementById("add-income");

const expenseNameInput = document.getElementById("expense-name");
const expenseAmountInput = document.getElementById("expense-amount");
const expenseCategorySelect = document.getElementById("expense-category");
const addExpenseButton = document.getElementById("add-expense");

const balanceElement = document.getElementById("balance");
const transactionsList = document.getElementById("transactions");

let transactions = JSON.parse(localStorage.getItem("transactions")) || [];

function updateBalance() {
  const balance = transactions.reduce((total, transaction) => {
    return transaction.type === "income" ? total + transaction.amount : total - transaction.amount;
  }, 0);
  balanceElement.textContent = `${balance} ₽`;
}

function renderTransactions() {
  transactionsList.innerHTML = "";
  transactions.forEach((transaction, index) => {
    const li = document.createElement("li");
    li.textContent = `${transaction.name} (${transaction.category}): ${transaction.amount} ₽ [${transaction.type === "income" ? "Доход" : "Расход"}]`;

    const deleteButton = document.createElement("button1");
    deleteButton.textContent = "Удалить";
    deleteButton.className = "delete-btn";
    deleteButton.addEventListener("click", () => {
      transactions.splice(index, 1);
      saveTransactions();
      renderTransactions();
      updateBalance();
    });

    li.appendChild(deleteButton);
    transactionsList.appendChild(li);
  });
}

function saveTransactions() {
  localStorage.setItem("transactions", JSON.stringify(transactions));
}

addIncomeButton.addEventListener("click", () => {
  const name = incomeNameInput.value.trim();
  const amount = parseFloat(incomeAmountInput.value.trim());
  const category = incomeCategorySelect.value;

  if (name && !isNaN(amount) && category) {
    transactions.push({ name, amount, category, type: "income" });
    saveTransactions();
    renderTransactions();
    updateBalance();
    incomeNameInput.value = "";
    incomeAmountInput.value = "";
    incomeCategorySelect.value = "";
  } else {
    alert("Пожалуйста, введите корректные данные для дохода!");
  }
});

addExpenseButton.addEventListener("click", () => {
  const name = expenseNameInput.value.trim();
  const amount = parseFloat(expenseAmountInput.value.trim());
  const category = expenseCategorySelect.value;

  if (name && !isNaN(amount) && category) {
    transactions.push({ name, amount, category, type: "expense" });
    saveTransactions();
    renderTransactions();
    updateBalance();
    expenseNameInput.value = "";
    expenseAmountInput.value = "";
    expenseCategorySelect.value = "";
  } else {
    alert("Пожалуйста, введите корректные данные для расхода!");
  }
});

renderTransactions();
updateBalance();
