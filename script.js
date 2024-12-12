// Script.js

// DOM Elements
const incomeForm = document.getElementById("income-form");
const expenseForm = document.getElementById("expense-form");
const incomeAmountInput = document.getElementById("income-amount");
const incomeCategoryInput = document.getElementById("income-category");
const expenseAmountInput = document.getElementById("expense-amount");
const expenseCategoryInput = document.getElementById("expense-category");
const transactionsList = document.getElementById("transactions-list");
const totalBalance = document.getElementById("total-balance");
const filterCategory = document.getElementById("filter-category");
const filterDate = document.getElementById("filter-date");
const filterButton = document.getElementById("filter-btn");

// Predefined Categories
const incomeCategories = ["Salary", "Freelance", "Investment", "Gift", "Other"];
const expenseCategories = [
    "Food", "Transport", "Entertainment", "Utilities", "Health",
    "Shopping", "Education", "Rent", "Travel", "Subscriptions", "Other"
];

// Transactions array
let transactions = JSON.parse(localStorage.getItem("transactions")) || [];

// Utility Functions
function saveTransactions() {
    localStorage.setItem("transactions", JSON.stringify(transactions));
}

function updateBalance() {
    const total = transactions.reduce((acc, transaction) => {
        return acc + transaction.amount;
    }, 0);
    totalBalance.textContent = `$${total.toFixed(2)}`;
    totalBalance.style.color = total >= 0 ? "#28a745" : "#dc3545";
}

function renderTransactions(filter = null) {
    transactionsList.innerHTML = "";
    let filteredTransactions = transactions;

    // Apply filters if provided
    if (filter) {
        if (filter.category) {
            filteredTransactions = filteredTransactions.filter(t => t.category === filter.category);
        }
        if (filter.date) {
            filteredTransactions = filteredTransactions.filter(t => {
                const transactionDate = new Date(t.date).toISOString().split("T")[0];
                return transactionDate === filter.date;
            });
        }
    }

    // Render transactions
    filteredTransactions.forEach((transaction, index) => {
        const li = document.createElement("li");
        li.innerHTML = `${transaction.category}: $${transaction.amount.toFixed(2)} (${transaction.type})
            <button class='delete-btn' data-index='${index}'>X</button>`;
        transactionsList.appendChild(li);
    });

    // Add delete functionality
    document.querySelectorAll(".delete-btn").forEach(button => {
        button.addEventListener("click", (e) => {
            const index = e.target.getAttribute("data-index");
            transactions.splice(index, 1);
            saveTransactions();
            updateBalance();
            renderTransactions(filter);
        });
    });
}

function populateCategoryDropdowns() {
    incomeCategories.forEach(category => {
        const option = document.createElement("option");
        option.value = category;
        option.textContent = category;
        incomeCategoryInput.appendChild(option);
        filterCategory.appendChild(option.cloneNode(true));
    });

    expenseCategories.forEach(category => {
        const option = document.createElement("option");
        option.value = category;
        option.textContent = category;
        expenseCategoryInput.appendChild(option);
        filterCategory.appendChild(option.cloneNode(true));
    });
}

// Add Income
incomeForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const amount = parseFloat(incomeAmountInput.value);
    const category = incomeCategoryInput.value;
    if (!amount || !category) return;

    const transaction = {
        type: "Income",
        amount,
        category,
        date: new Date().toISOString()
    };

    transactions.push(transaction);
    saveTransactions();
    updateBalance();
    renderTransactions();
    incomeForm.reset();
});

// Add Expense
expenseForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const amount = parseFloat(expenseAmountInput.value);
    const category = expenseCategoryInput.value;
    if (!amount || !category) return;

    const transaction = {
        type: "Expense",
        amount: -Math.abs(amount),
        category,
        date: new Date().toISOString()
    };

    transactions.push(transaction);
    saveTransactions();
    updateBalance();
    renderTransactions();
    expenseForm.reset();
});

// Filter Transactions
filterButton.addEventListener("click", () => {
    const category = filterCategory.value;
    const date = filterDate.value;
    const filter = {};

    if (category) filter.category = category;
    if (date) filter.date = date;

    renderTransactions(filter);
});

// Initialize
populateCategoryDropdowns();
updateBalance();
renderTransactions();
