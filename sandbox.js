// Select forms and list
const incomeForm = document.getElementById('income-form');
const debtForm = document.getElementById('debt-form');
const expensesForm = document.getElementById('expenses-form');
const entriesList = document.querySelector('.entries-list');

// Helper function to save to localStorage
function saveEntry(type, data) {
  const entries = JSON.parse(localStorage.getItem(type)) || [];
  entries.push(data);
  localStorage.setItem(type, JSON.stringify(entries));
}

// Helper function to render entries
function renderEntries() {
  entriesList.innerHTML = '';
  const allEntries = ['income', 'debt', 'expenses'].flatMap(type => {
    const entries = JSON.parse(localStorage.getItem(type)) || [];
    return entries.map(entry => ({ ...entry, type }));
  });

  allEntries.forEach(entry => {
    const li = document.createElement('li');
    li.className = `${entry.type}-entry`;
    li.textContent = `${entry.type.toUpperCase()}: ${entry.source} - #${entry.amount} on ${entry.date} (${entry.category})`;
    entriesList.appendChild(li);
  });
}

// Form submission handlers
[incomeForm, debtForm, expensesForm].forEach(form => {
  form.addEventListener('submit', e => {
    e.preventDefault();
    const formData = new FormData(form);
    const entry = {
      source: formData.get('source'),
      amount: formData.get('amount'),
      date: formData.get('date'),
      category: formData.get('category'),
    };
    saveEntry(form.id.split('-')[0], entry);
    form.reset();
    renderEntries();
  });
});

// Initial render
document.addEventListener('DOMContentLoaded', renderEntries);
