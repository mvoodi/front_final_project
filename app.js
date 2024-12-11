const addTransactionButton = document.getElementById("add-transaction");
const transactionNameInput = document.getElementById("transaction-name");
const transactionAmountInput = document.getElementById("transaction-amount");
const transactionCategorySelect = document.getElementById("transaction-category");
const transactionTypeSelect = document.getElementById("transaction-type");
const balanceElement = document.getElementById("balance");
const transactionsList = document.getElementById("transactions");
const categoryFilterSelect = document.getElementById("category-filter");

let transactions = JSON.parse(localStorage.getItem("transactions")) || [];

function updateBalance() {
  const balance = transactions.reduce((total, transaction) => {
    return transaction.type === "income" ? total + transaction.amount : total - transaction.amount;
  }, 0);
  balanceElement.textContent = `${balance} ₽`;
}

function renderTransactions(filteredTransactions = transactions) {
  transactionsList.innerHTML = "";
  filteredTransactions.forEach((transaction, index) => {
    const li = document.createElement("li");
    li.textContent = `${transaction.name} (${transaction.category}): ${transaction.amount} ₽ [${transaction.type === "income" ? "Доход" : "Расход"}]`;

    const deleteButton = document.createElement("button");
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

addTransactionButton.addEventListener("click", () => {
  const name = transactionNameInput.value.trim();
  const amount = parseFloat(transactionAmountInput.value.trim());
  const category = transactionCategorySelect.value;
  const type = transactionTypeSelect.value;

  if (name && !isNaN(amount) && category && type) {
    const newTransaction = { name, amount, category, type };
    transactions.push(newTransaction);
    saveTransactions();
    renderTransactions();
    updateBalance();
    transactionNameInput.value = "";
    transactionAmountInput.value = "";
    transactionCategorySelect.value = "";
    transactionTypeSelect.value = "expense";
  } else {
    alert("Пожалуйста, введите корректные данные!");
  }
});

categoryFilterSelect.addEventListener("change", (e) => {
  const categoryFilter = e.target.value;
  const filteredTransactions = categoryFilter
    ? transactions.filter(transaction => transaction.category === categoryFilter)
    : transactions;
  renderTransactions(filteredTransactions);
});

renderTransactions();
updateBalance();
