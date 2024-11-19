// Consolidated data array
const financeData = [];

// Function to add data to the table
function addToTable(source, amount, date, category, type) {
  const table = document.getElementById("expenses-result");

  // Create a new row
  const row = document.createElement("tr");

  // Add cells for each column
  row.innerHTML = `
        <td>${
          type === "income"
            ? "Income: "
            : type === "debt"
            ? "Debt: "
            : "Expense: "
        } ${source}</td>
        <td>#${amount}</td>
        <td>${date}</td>
        <td>${category}</td>
        <td class="delete">
            <img src="images/delete.svg" alt="Delete Icon" class="delete-icon" style="cursor: pointer; width: 20px; height: 20px;">
        </td>
    `;

  // Append the row to the table
  table.appendChild(row);

  // Add delete functionality
  row.querySelector(".delete-icon").addEventListener("click", () => {
    const index = financeData.findIndex(
      (item) =>
        item.source === source &&
        item.amount === amount &&
        item.date === date &&
        item.category === category &&
        item.type === type
    );

    // Remove from array and table
    if (index !== -1) financeData.splice(index, 1);
    table.removeChild(row);

    // Update JSON data and category totals
    updateCategoryTotals();
    logFinanceJSON();
  });
}

// Function to handle form submissions
function handleFormSubmit(event, type) {
  event.preventDefault();

  // Get form values
  const form = event.target;
  const source = form.querySelector(`[id*='source']`).value;
  const amount = parseFloat(form.querySelector(`[id*='amount']`).value);
  const date = form.querySelector(`[id*='date']`).value;
  const category = form.querySelector(`[id*='category']`).value;

  // Add to table and data array
  addToTable(source, amount, date, category, type);
  financeData.push({ type, source, amount, date, category });

  // Update category totals and log JSON
  updateCategoryTotals();
  logFinanceJSON();

  // Clear the form
  form.reset();
}

// Function to update the category totals
function updateCategoryTotals() {
    // Initialize totals for each category
    const categoryTotals = {
        food: 0,
        groceries: 0,
        shopping: 0,
        transport: 0,
        entertainment: 0,
        utilities: 0,
        health: 0,
        home: 0,
        income: 0,
        debt: 0,
        total: 0 // Total starts at 0
    };

    // Calculate totals based on financeData
    financeData.forEach((item) => {
        if (item.category in categoryTotals) {
            // Add amounts to respective categories
            categoryTotals[item.category] += item.amount;
        }

        // Update total based on type
        if (item.type === 'income') {
            categoryTotals.total += item.amount; // Add income
        } else if (item.type === 'debt' || item.type === 'expense') {
            categoryTotals.total -= item.amount; // Subtract debt/expense
        }
    });

    // Update the category divs
    for (const [key, value] of Object.entries(categoryTotals)) {
        const amountElement = document.querySelector(`.amount-${key}`);
        if (amountElement) {
            amountElement.textContent = value.toLocaleString(); // Format number with commas
        }
    }

    // Update feedback based on total amount
    const totalAmount = categoryTotals.total;
    const feedbackText = document.getElementById("feedback-text");
    const feedbackImage = document.getElementById("feedback-image");

    if (totalAmount < 0) {
        feedbackText.textContent = "You need to make more money";
        feedbackImage.src = "images/verybad.svg";
    } else if (totalAmount >= 0 && totalAmount <= 50000) {
        feedbackText.textContent = "You can save more than you spend";
        feedbackImage.src = "images/poor.svg";
    } else if (totalAmount >= 50001 && totalAmount <= 100000) {
        feedbackText.textContent = "Great, but you can do better";
        feedbackImage.src = "images/good.svg";
    } else if (totalAmount > 100000) {
        feedbackText.textContent = "Nice, keep saving";
        feedbackImage.src = "images/verygood.svg";
    }
}


// Function to log the JSON data
function logFinanceJSON() {
  const jsonData = JSON.stringify(financeData, null, 2);
  console.log("Updated JSON Data:\n", jsonData);
}

// Attach event listeners to all forms
document
  .getElementById("income-form")
  .addEventListener("submit", (e) => handleFormSubmit(e, "income"));
document
  .getElementById("debt-form")
  .addEventListener("submit", (e) => handleFormSubmit(e, "debt"));
document
  .getElementById("expenses-form")
  .addEventListener("submit", (e) => handleFormSubmit(e, "expense"));
