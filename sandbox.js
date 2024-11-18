document.addEventListener("DOMContentLoaded", () => {
  // Initialize or retrieve data from localStorage
  const categories = JSON.parse(localStorage.getItem("categories")) || {};
  const expensesList = JSON.parse(localStorage.getItem("expenses")) || [];

  // Function to update category amounts
  const updateCategoryAmount = (category, amount) => {
    // Update the category total in the object
    categories[category] = (categories[category] || 0) + amount;

    // Update the category total in localStorage
    localStorage.setItem("categories", JSON.stringify(categories));

    // Update the displayed amount
    const categoryElement = document.querySelector(
      `.category h3:contains(${category})`
    )?.parentElement.nextElementSibling;

    if (categoryElement) {
      categoryElement.textContent = categories[category].toLocaleString();
    }
  };

  // Function to add an entry to the Expenses table
  const addExpenseToTable = ({ source, amount, date, category }) => {
    const table = document.getElementById("expenses-result");

    const newRow = table.insertRow();
    newRow.innerHTML = `
            <td>${source}</td>
            <td>${amount.toLocaleString()}</td>
            <td>${new Date(date).toLocaleDateString()}</td>
            <td>${category}</td>
        `;
  };

  // Load stored data into the table and categories
  const loadStoredData = () => {
    // Populate categories
    for (const [category, amount] of Object.entries(categories)) {
      updateCategoryAmount(category, 0); // Update the display only
    }

    // Populate the Expenses table
    expensesList.forEach(addExpenseToTable);
  };

  // Function to handle form submissions
  const handleFormSubmit = (event, formType) => {
    event.preventDefault();

    const form = event.target;
    const source = form.querySelector('[name="source"]').value;
    const amount = parseFloat(form.querySelector('[name="amount"]').value);
    const date = form.querySelector('[name="date"]').value;
    const category = form.querySelector('[name="category"]').value;

    if (!source || isNaN(amount) || !date || !category) return;

    // Update the category total
    updateCategoryAmount(category, amount);

    // Save the entry to localStorage
    const entry = { source, amount, date, category, type: formType };
    expensesList.push(entry);
    localStorage.setItem("expenses", JSON.stringify(expensesList));

    // Add the entry to the table
    addExpenseToTable(entry);

    // Reset the form
    form.reset();
  };

  // Attach event listeners to forms
  document
    .getElementById("income-form")
    .addEventListener("submit", (event) => handleFormSubmit(event, "Income"));
  document
    .getElementById("debt-form")
    .addEventListener("submit", (event) => handleFormSubmit(event, "Debt"));
  document
    .getElementById("expenses-form")
    .addEventListener("submit", (event) => handleFormSubmit(event, "Expense"));

  // Load stored data on page load
  loadStoredData();
});
