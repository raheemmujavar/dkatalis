# ATM CLI Application

This is a command-line interface (CLI) application that simulates an ATM system.

## Features

- Customer login/logout
- Deposit funds
- Withdraw funds
- Transfer funds between customers
- Automatic debt tracking and repayment
- Balance display with debt/credit information

## Requirements

- Node.js (Latest version)
- npm (comes with Node.js)

## Installation & Running

1. Make the start script executable:
   ```bash
   chmod +x start.sh
   ```

2. Run the application:
   ```bash
   ./start.sh
   ```
   

## Available Commands

- `login [name]` - Log in as customer (creates new customer if doesn't exist)
- `deposit [amount]` - Deposit money into current account
- `withdraw [amount]` - Withdraw money from current account
- `transfer [target] [amount]` - Transfer money to another customer
- `logout` - Log out current customer
- `exit` - Exit the application

## Testing

Run the tests with:
```bash
npm install --dev
npm test
```

## Assumptions

1. All amounts are in whole numbers or decimals
2. Negative amounts are not allowed
3. New customers start with $0 balance
4. Debts are automatically paid when funds become available
5. The system maintains state only during runtime
6. Each execution of start.sh creates a fresh environment

## Error Handling

The application handles various edge cases:
- Invalid commands
- Invalid amounts
- Insufficient funds
- Transfer to non-existent customers
- Operations without being logged in
