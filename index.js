function formatCurrency(value) {
    const formatter = Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    });
    return formatter.format(value);
  }
  
 
  function createTransactionContainer(id) {
    const container = document.createElement('div');
    container.classList.add('transaction');
    container.id = `transaction-${id}`;
    return container;
  }
  
  function createTransactionTitle(name) {
    const title = document.createElement('span');
    title.classList.add('transaction-title');
    title.textContent = name;
    return title;
  }
  
  function createTransactionAmount(amount) {
    const span = document.createElement('span');
    span.classList.add('transaction-amount');
    const formattedAmount = formatCurrency(amount);
    span.textContent = amount > 0 ? `${formattedAmount} C` : `${formattedAmount} D`;
    span.classList.add(amount > 0 ? 'credit' : 'debit');
    return span;
  }
  
  function renderTransaction(transaction) {
    const container = createTransactionContainer(transaction.id);
    const title = createTransactionTitle(transaction.name);
    const amount = createTransactionAmount(transaction.amount);
    const editBtn = createEditTransactionBtn(transaction);
    const deleteBtn = createDeleteTransactionButton(transaction.id);
  
    container.append(title, amount, editBtn, deleteBtn);
    document.querySelector('#transactions').append(container);
  }
  
  function updateBalance() {
    const balanceSpan = document.querySelector('#balance');
    const balance = transactions.reduce((sum, transaction) => sum + transaction.amount, 0);
    balanceSpan.textContent = formatCurrency(balance);
  }
  
  async function fetchTransactions() {
    try {
      const response = await fetch('http://localhost:3000/transactions');
      if (!response.ok) throw new Error('Erro ao buscar transações');
      return await response.json();
    } catch (error) {
      console.error('Erro ao buscar transações:', error);
      return [];
    }
  }
  
  async function saveTransaction(ev) {
    ev.preventDefault();
  
    const id = document.querySelector('#id').value;
    const name = document.querySelector('#name').value;
    const amount = parseFloat(document.querySelector('#amount').value) || 0;
  
    try {
      if (id) {
       
        const response = await fetch(`http://localhost:3000/transactions/${id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name, amount }),
        });
        if (!response.ok) throw new Error('Erro ao atualizar transação');
        const updatedTransaction = await response.json();
  
        const index = transactions.findIndex((t) => t.id === Number(id));
        if (index >= 0) transactions.splice(index, 1, updatedTransaction);
  
        document.querySelector(`#transaction-${id}`).remove();
        renderTransaction(updatedTransaction);
      } else {
        
          const response = await fetch('http://localhost:3000/transactions', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name, amount }),
        });
        if (!response.ok) throw new Error('Erro ao criar transação');
        const newTransaction = await response.json();
  
        transactions.push(newTransaction);
        renderTransaction(newTransaction);
      }
  
      ev.target.reset();
      updateBalance();
    } catch (error) {
      console.error('Erro ao salvar transação:', error);
    }
  }
  
  function createEditTransactionBtn(transaction) {
    const editBtn = document.createElement('button');
    editBtn.classList.add('edit-btn');
    editBtn.textContent = 'Editar';
    editBtn.addEventListener('click', () => {
      document.querySelector('#id').value = transaction.id;
      document.querySelector('#name').value = transaction.name;
      document.querySelector('#amount').value = transaction.amount;
    });
    return editBtn;
  }
  
  function createDeleteTransactionButton(id) {
    const deleteBtn = document.createElement('button');
    deleteBtn.classList.add('delete-btn');
    deleteBtn.textContent = 'Excluir';
    deleteBtn.addEventListener('click', async () => {
      try {
        const response = await fetch(`http://localhost:3000/transactions/${id}`, { method: 'DELETE' });
        if (!response.ok) throw new Error('Erro ao excluir transação');
  
        deleteBtn.parentElement.remove();
        const index = transactions.findIndex((t) => t.id === id);
        if (index >= 0) transactions.splice(index, 1);
        updateBalance();
      } catch (error) {
        console.error('Erro ao excluir transação:', error);
      }
    });
    return deleteBtn;
  }
  
 // Initial Setup

async function setup() {
    try {
      const results = await fetchTransactions();
      transactions.push(...results);
      transactions.forEach(renderTransaction);
      updateBalance();
    } catch (error) {
      console.error('Erro na inicialização:', error);
    }
  }
  
  let transactions = [];
  
// Page initialization
  document.addEventListener('DOMContentLoaded', setup);
  document.querySelector('form').addEventListener('submit', saveTransaction);
  
