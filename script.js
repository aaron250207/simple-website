document.addEventListener('DOMContentLoaded', function() {
  const startButton = document.getElementById('startButton');
  const loginSection = document.getElementById('loginSection');
  const loginForm = document.getElementById('loginForm');
  const dashboardSection = document.getElementById('dashboardSection');
  const logoutButton = document.getElementById('logoutButton');
  const stocksButton = document.getElementById('stocksButton');
  const stocksSection = document.getElementById('stocksSection');
  const stocksBackButton = document.getElementById('stocksBackButton');
  const stocksForm = document.getElementById('stocksForm');
  const itemNameInput = document.getElementById('itemName');
  const itemPriceInput = document.getElementById('itemPrice');
  const customerNameInput = document.getElementById('customerName');
  const addItemButton = document.getElementById('addItemButton');
  const stocksList = document.getElementById('stocksList');
  const clearItemsButton = document.getElementById('clearItemsButton');
  const totalEarnings = document.getElementById('totalEarnings');
  const totalLoan = document.getElementById('totalLoan');
  
  let items = []; // Array to store items
  let earnings = 0; // Variable to store earnings
  let loan = 0; // Variable to store loan

  // Load items from local storage if available
  if (localStorage.getItem('items')) {
    items = JSON.parse(localStorage.getItem('items'));
    calculateEarnings();
    calculateTotalLoan();
  }

  // Function to save items to local storage
  function saveItems() {
    localStorage.setItem('items', JSON.stringify(items));
  }

  // Function to calculate total earnings
  function calculateEarnings() {
    earnings = items.reduce(function(acc, item) {
      if (item.paid) {
        return acc + parseFloat(item.price);
      }
      return acc;
    }, 0);
    totalEarnings.textContent = earnings.toFixed(2);
  }
  
  // Function to calculate total loan
  function calculateTotalLoan() {
    loan = items.reduce(function(acc, item) {
      if (item.loaned) {
        return acc + parseFloat(item.price);
      }
      return acc;
    }, 0);
    totalLoan.textContent = loan.toFixed(2);
  }

  // Function to render items in the Stocks section
  function renderItems() {
    stocksList.innerHTML = '';
    items.forEach(function(item, index) {
      const li = document.createElement('li');
      li.textContent = `Item: ${item.name} - Price: ${item.price} - Customer: ${item.customer}`;
      li.setAttribute('data-index', index);

      const deleteButton = document.createElement('button');
      deleteButton.textContent = 'Delete';
      li.appendChild(deleteButton);

      const paidButton = document.createElement('button');
      paidButton.textContent = 'Paid';
      li.appendChild(paidButton);

      const loanButton = document.createElement('button');
      loanButton.textContent = 'Loan';
      li.appendChild(loanButton);

      if (item.paid) {
        li.classList.add('paid');
      }
      if (item.loaned) {
        li.classList.add('loaned');
      }

      stocksList.appendChild(li);
    });
  }

  // Function to toggle between sections
  function toggleSection(showSection, hideSections) {
    showSection.classList.remove('hidden');
    hideSections.forEach(function(section) {
      section.classList.add('hidden');
    });
  }

  startButton.addEventListener('click', function() {
    toggleSection(loginSection, [document.getElementById('introSection')]);
  });

  loginForm.addEventListener('submit', function(event) {
    event.preventDefault();
    const usernameInput = document.getElementById('username');
    const passwordInput = document.getElementById('password');
    const username = usernameInput.value.trim();
    const password = passwordInput.value.trim();
    if (username === 'john' && password === 'galingana') {
      toggleSection(dashboardSection, [loginSection]);
      usernameInput.value = '';
      passwordInput.value = '';
    } else {
      alert('Invalid username or password. Please try again.');
    }
  });

  logoutButton.addEventListener('click', function() {
    toggleSection(loginSection, [dashboardSection]);
  });

  stocksButton.addEventListener('click', function() {
    toggleSection(stocksSection, [dashboardSection]);
    renderItems();
  });

  stocksBackButton.addEventListener('click', function() {
    toggleSection(dashboardSection, [stocksSection]);
  });

  stocksForm.addEventListener('submit', function(event) {
    event.preventDefault();
    const itemName = itemNameInput.value.trim();
    const itemPrice = parseFloat(itemPriceInput.value.trim());
    const customerName = customerNameInput.value.trim();
    if (itemName && itemPrice && customerName) {
      const item = {
        name: itemName,
        price: itemPrice.toFixed(2),
        customer: customerName,
        paid: false,
        loaned: false
      };
      items.push(item);
      saveItems();
      calculateEarnings();
      calculateTotalLoan();
      renderItems();
      itemNameInput.value = '';
      itemPriceInput.value = '';
      customerNameInput.value = '';
    }
  });

  stocksList.addEventListener('click', function(event) {
    if (event.target.tagName === 'BUTTON') {
      const li = event.target.parentNode;
      const index = parseInt(li.getAttribute('data-index'));
      if (event.target.textContent === 'Delete') {
        items.splice(index, 1);
        saveItems();
        calculateEarnings();
        calculateTotalLoan();
        renderItems();
      } else if (event.target.textContent === 'Paid') {
        items[index].paid = true;
        items[index].loaned = false;
        saveItems();
        calculateEarnings();
        calculateTotalLoan();
        renderItems();
      } else if (event.target.textContent === 'Loan') {
        items[index].loaned = true;
        items[index].paid = false;
        saveItems();
        calculateEarnings();
        calculateTotalLoan();
        renderItems();
      }
    }
  });

  clearItemsButton.addEventListener('click', function() {
    items = [];
    saveItems();
    calculateEarnings();
    calculateTotalLoan();
    renderItems();
  });
});
