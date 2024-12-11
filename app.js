const addTransactionButton = document.getElementById("add-transaction");
const transactionNameInput = document.getElementById("transaction-name");
const transactionAmountInput = document.getElementById("transaction-amount");
const balanceElement = document.getElementById("balance");
const transactionsList = document.getElementById("transactions");

let transactions = [];

function updateBalance() {
  const balance = transactions.reduce((total, transaction) => total + transaction.amount, 0);
  balanceElement.textContent = `${balance} ₽`;
}

function renderTransactions() {
  transactionsList.innerHTML = ""; 
  transactions.forEach((transaction, index) => {
    const li = document.createElement("li");
    li.textContent = `${transaction.name}: ${transaction.amount} ₽`;
    
    // Кнопка для удаления транзакции
    const deleteButton = document.createElement("button");
    deleteButton.textContent = "Удалить";
    deleteButton.addEventListener("click", () => {
      transactions.splice(index, 1); 
      renderTransactions(); 
      updateBalance(); 
    });

    li.appendChild(deleteButton);
    transactionsList.appendChild(li);
  });
}

addTransactionButton.addEventListener("click", () => {
  const name = transactionNameInput.value.trim();
  const amount = parseFloat(transactionAmountInput.value.trim());

  if (name && !isNaN(amount)) {
    const newTransaction = { name, amount };
    transactions.push(newTransaction);
    renderTransactions();
    updateBalance();
    transactionNameInput.value = "";
    transactionAmountInput.value = "";
  } else {
    alert("Пожалуйста, введите корректные данные!");
  }
});

renderTransactions();
updateBalance();
