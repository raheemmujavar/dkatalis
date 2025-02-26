import { expect } from 'chai';
import { ATM } from './atm';

describe('ATM', () => {
  let atm;

  beforeEach(() => {
    atm = new ATM();
  });

  describe('login', () => {
    it('should create a new customer if not exists', async () => {
      await atm.login('Alice');
      expect(atm.customers.has('Alice')).to.be.true;
    });

    it('should set the current customer', async () => {
      await atm.login('Alice');
      expect(atm.currentCustomer).to.equal('Alice');
    });
  });

  describe('logout', () => {
    it('should throw an error if no customer is logged in', async () => {
      try {
        await atm.logout();
      } catch (error) {
        expect(error.message).to.equal('No customer is logged in');
      }
    });

    it('should logout the current customer', async () => {
      await atm.login('Alice');
      await atm.logout();
      expect(atm.currentCustomer).to.be.null;
    });
  });

  describe('deposit', () => {
    it('should throw an error if no customer is logged in', async () => {
      try {
        await atm.deposit(100);
      } catch (error) {
        expect(error.message).to.equal('No customer is logged in');
      }
    });

    it('should throw an error if amount is not positive', async () => {
      await atm.login('Alice');
      try {
        await atm.deposit(-100);
      } catch (error) {
        expect(error.message).to.equal('Amount must be positive');
      }
    });

    it('should increase the customer balance', async () => {
      await atm.login('Alice');
      await atm.deposit(100);
      const customer = atm.customers.get('Alice');
      expect(customer.balance).to.equal(100);
    });
  });

  describe('withdraw', () => {
    it('should throw an error if no customer is logged in', async () => {
      try {
        await atm.withdraw(100);
      } catch (error) {
        expect(error.message).to.equal('No customer is logged in');
      }
    });

    it('should throw an error if amount is not positive', async () => {
      await atm.login('Alice');
      try {
        await atm.withdraw(-100);
      } catch (error) {
        expect(error.message).to.equal('Amount must be positive');
      }
    });

    it('should throw an error if insufficient funds', async () => {
      await atm.login('Alice');
      try {
        await atm.withdraw(100);
      } catch (error) {
        expect(error.message).to.equal('Insufficient funds');
      }
    });

    it('should decrease the customer balance', async () => {
      await atm.login('Alice');
      await atm.deposit(100);
      await atm.withdraw(50);
      const customer = atm.customers.get('Alice');
      expect(customer.balance).to.equal(50);
      await atm.withdraw(50);
      expect(customer.balance).to.equal(0);
    });
  });

  describe('transfer', () => {
    it('should throw an error if no customer is logged in', async () => {
      try {
        await atm.transfer('Bob', 100);
      } catch (error) {
        expect(error.message).to.equal('No customer is logged in');
      }
    });

    it('should throw an error if amount is not positive', async () => {
      await atm.login('Alice');
      try {
        await atm.transfer('Bob', -100);
      } catch (error) {
        expect(error.message).to.equal('Amount must be positive');
      }
    });

    it('should throw an error if target customer does not exist', async () => {
      await atm.login('Alice');
      try {
        await atm.transfer('Bob', 100);
      } catch (error) {
        expect(error.message).to.equal('Target customer does not exist');
      }
    });

    it('should transfer amount to target customer', async () => {
      await atm.login('Alice');
      await atm.deposit(100);
      await atm.login('Bob');
      await atm.deposit(50);
      await atm.transfer('Alice', 50);
      const alice = atm.customers.get('Alice');
      const bob = atm.customers.get('Bob');
      expect(alice.balance).to.equal(150);
      expect(bob.balance).to.equal(0);
    });

    it('should create a debt if insufficient funds', async () => {
      await atm.login('Alice');
      await atm.deposit(50);
      await atm.login('Bob');
      await atm.transfer('Alice', 100);
      const alice = atm.customers.get('Alice');
      const bob = atm.customers.get('Bob');
      expect(alice.balance).to.equal(50);
      expect(bob.balance).to.equal(0);
      expect(bob.debts.get('Alice')).to.equal(100);
    });
  });
});