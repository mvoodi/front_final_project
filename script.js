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

const reportMonth = document.getElementById("report-month");
const generateReportBtn = document.getElementById("generate-report-btn");
const reportOutput = document.getElementById("report-output");

generateReportBtn.addEventListener("click", () => {
    const selectedMonth = reportMonth.value; // Format: "YYYY-MM"
    if (!selectedMonth) return;

    const [year, month] = selectedMonth.split("-");
    const filteredTransactions = transactions.filter(transaction => {
        const transactionDate = new Date(transaction.date);
        return (
            transactionDate.getFullYear() === parseInt(year) &&
            transactionDate.getMonth() + 1 === parseInt(month)
        );
    });

    const income = filteredTransactions
        .filter(t => t.type === "Income")
        .reduce((acc, t) => acc + t.amount, 0);

    const expenses = filteredTransactions
        .filter(t => t.type === "Expense")
        .reduce((acc, t) => acc + t.amount, 0);

    reportOutput.innerHTML = `
        <h4>Financial Report for ${selectedMonth}</h4>
        <p>Total Income: $${income.toFixed(2)}</p>
        <p>Total Expenses: $${Math.abs(expenses).toFixed(2)}</p>
        <p>Net Balance: $${(income + expenses).toFixed(2)}</p>
    `;
});
const API_URL = "https://example.com/api/transactions";

// Load transactions from API
async function loadTransactions() {
    try {
        const response = await fetch(`${API_URL}/load`);
        const data = await response.json();
        transactions = data;
        saveTransactions(); // Сохраняем в localStorage
        updateBalance();
        renderTransactions();
    } catch (error) {
        console.error("Error loading transactions:", error);
    }
}

// Save transactions to API
async function saveToAPI() {
    try {
        await fetch(`${API_URL}/save`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(transactions),
        });
    } catch (error) {
        console.error("Error saving transactions:", error);
    }
}

// Update saveTransactions function to include API sync
function saveTransactions() {
    localStorage.setItem("transactions", JSON.stringify(transactions));
    saveToAPI(); // Sync with API
}

// Call loadTransactions on initialization
loadTransactions();


// Include Chart.js library in your HTML file:
// <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>

const chartCanvas = document.getElementById("income-expense-chart");

function renderChart() {
    const income = transactions
        .filter(t => t.type === "Income")
        .reduce((acc, t) => acc + t.amount, 0);

    const expenses = transactions
        .filter(t => t.type === "Expense")
        .reduce((acc, t) => acc + t.amount, 0);

    const chartData = {
        labels: ["Income", "Expenses"],
        datasets: [
            {
                label: "Financial Overview",
                data: [income, Math.abs(expenses)],
                backgroundColor: ["#28a745", "#dc3545"],
            },
        ],
    };

    new Chart(chartCanvas, {
        type: "doughnut",
        data: chartData,
    });
}

// Call renderChart whenever transactions are updated
updateBalance = () => {
    const total = transactions.reduce((acc, transaction) => acc + transaction.amount, 0);
    totalBalance.textContent = `$${total.toFixed(2)}`;
    totalBalance.style.color = total >= 0 ? "#28a745" : "#dc3545";
    renderChart();
};

const ctx = document.getElementById('chart').getContext('2d');
new Chart(ctx, {
  type: 'bar', // Тип графика: 'bar', 'line', 'pie', 'doughnut', и т.д.
  data: {
    labels: ['Income', 'Expenses', 'Net Balance'], // Метки оси X
    datasets: [{
      label: 'Financial Summary',
      data: [51500, 6650, 45850], // Значения для оси Y
      backgroundColor: ['#1abc9c', '#e74c3c', '#3498db'], // Цвета
      borderWidth: 1
    }]
  },
  options: {
    responsive: true,
    plugins: {
      legend: {
        display: true,
        position: 'top'
      }
    }
  }
});



// Initialize
populateCategoryDropdowns();
updateBalance();
renderTransactions();
