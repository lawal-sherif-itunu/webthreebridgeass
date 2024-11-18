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

    // Update JSON file
    updateFinanceJSON();
  });
}

// Function to handle form submissions
function handleFormSubmit(event, type) {
  event.preventDefault();

  // Get form values
  const form = event.target;
  const source = form.querySelector(`[id*='source']`).value;
  const amount = form.querySelector(`[id*='amount']`).value;
  const date = form.querySelector(`[id*='date']`).value;
  const category = form.querySelector(`[id*='category']`).value;

  // Add to table and data array
  addToTable(source, amount, date, category, type);
  financeData.push({ type, source, amount, date, category });

  // Update JSON file
  updateFinanceJSON();

  // Clear the form
  form.reset();
}

// Function to update the JSON file
function updateFinanceJSON() {
  const jsonData = JSON.stringify(financeData, null, 2);
  console.log("Updated JSON Data:\n", jsonData);

  // Simulate saving JSON to file
  const blob = new Blob([jsonData], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "finance.JSON";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
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
