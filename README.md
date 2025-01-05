This project is a personal finance control API that uses the json-server library to simulate a backend. Its main feature is the management of financial transactions, allowing users to create, edit, and delete transactions while automatically updating the total balance. The backend simulation runs locally and communicates via HTTP requests.

The code is written in JavaScript and dynamically renders transactions in the user interface. Each transaction includes a title and an amount, formatted according to the Brazilian currency standard (BRL). The total balance is automatically recalculated whenever transactions are added, edited, or removed.

The application provides a simple interface to interact with financial data. Transactions are fetched from the simulated backend when the page loads and are displayed in the DOM. Updates to the balance occur in real-time based on the recorded transactions.

This project demonstrates essential concepts such as DOM manipulation, data formatting, and integration with REST APIs. It serves as a practical example for learning and experimenting with JavaScript and API interactions.

