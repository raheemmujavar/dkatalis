export class ATM {
  constructor() {
    this.customers = new Map();
    this.currentCustomer = null;
  }

  async login(name) {
    if (!this.customers.has(name)) {
      this.customers.set(name, {
        balance: 0,
        debts: new Map() // Map of customer name to amount owed
      });
    }

    this.currentCustomer = name;
    const customer = this.customers.get(name);
    
    console.log(`Hello, ${name}!`);
    this.displayBalance();
  }

  async logout() {
    if (!this.currentCustomer) {
      throw new Error('No customer is logged in');
    }

    console.log(`Goodbye, ${this.currentCustomer}!`);
    this.currentCustomer = null;
  }

  async deposit(amount) {
    this.checkLoggedIn();
    if (amount <= 0) {
      throw new Error('Amount must be positive');
    }

    const customer = this.customers.get(this.currentCustomer);
    customer.balance += amount;

    // Handle existing debts
    for (const [creditor, debt] of customer.debts.entries()) {
      if (debt > 0) {
        const paymentAmount = Math.min(customer.balance, debt);
        customer.balance -= paymentAmount;
        customer.debts.set(creditor, debt - paymentAmount);
        
        // Update creditor's balance
        const creditorAccount = this.customers.get(creditor);
        creditorAccount.balance += paymentAmount;
        
        if (paymentAmount > 0) {
          console.log(`Transferred $${paymentAmount} to ${creditor}`);
        }
      }
    }

    this.displayBalance();
  }

  async withdraw(amount) {
    this.checkLoggedIn();
    if (amount <= 0) {
      throw new Error('Amount must be positive');
    }

    const customer = this.customers.get(this.currentCustomer);
    if (customer.balance < amount) {
      throw new Error('Insufficient funds');
    }

    customer.balance -= amount;
    this.displayBalance();
  }

  async transfer(targetName, amount) {
    this.checkLoggedIn();
    if (amount <= 0) {
      throw new Error('Amount must be positive');
    }

    if (!this.customers.has(targetName)) {
      throw new Error('Target customer does not exist');
    }

    const sourceCustomer = this.customers.get(this.currentCustomer);
    const targetCustomer = this.customers.get(targetName);

    const transferAmount = Math.min(sourceCustomer.balance, amount);
    
    if (transferAmount > 0) {
      sourceCustomer.balance -= transferAmount;
      targetCustomer.balance += transferAmount;
      console.log(`Transferred $${transferAmount} to ${targetName}`);
    }

    if (transferAmount < amount) {
      const remainingAmount = amount - transferAmount;
      const currentDebt = sourceCustomer.debts.get(targetName) || 0;
      sourceCustomer.debts.set(targetName, currentDebt + remainingAmount);
    }

    this.displayBalance();
  }

  displayBalance() {
    this.checkLoggedIn();
    const customer = this.customers.get(this.currentCustomer);
    
    console.log(`Your balance is $${customer.balance}`);

    // Display debts
    for (const [creditor, debt] of customer.debts.entries()) {
      if (debt > 0) {
        console.log(`Owed $${debt} to ${creditor}`);
      }
    }

    // Display credits (money owed to current customer)
    for (const [debtor, debtorInfo] of this.customers.entries()) {
      const debtToCurrentCustomer = debtorInfo.debts.get(this.currentCustomer);
      if (debtToCurrentCustomer > 0) {
        console.log(`Owed $${debtToCurrentCustomer} from ${debtor}`);
      }
    }
  }

  checkLoggedIn() {
    if (!this.currentCustomer) {
      throw new Error('No customer is logged in');
    }
  }
}