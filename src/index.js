import * as readline from 'node:readline';
import { ATM } from './atm.js';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const atm = new ATM();

async function processCommand(input) {
  console.log('Processing command:', input);
  // if(input != undefined) {
   const [command, ...args] = input.trim().split(' ');
  // }

  try {
    switch (command.toLowerCase()) {
      case 'login':
        if (args.length !== 1) {
          console.log('Usage: login [name]');
          return;
        }
        await atm.login(args[0]);
        break;

      case 'deposit':
        if (args.length !== 1 || isNaN(args[0])) {
          console.log('Usage: deposit [amount]');
          return;
        }
        await atm.deposit(parseFloat(args[0]));
        break;

      case 'withdraw':
        if (args.length !== 1 || isNaN(args[0])) {
          console.log('Usage: withdraw [amount]');
          return;
        }
        await atm.withdraw(parseFloat(args[0]));
        break;

      case 'transfer':
        if (args.length !== 2 || isNaN(args[1])) {
          console.log('Usage: transfer [target] [amount]');
          return;
        }
        if(args[0] === atm.currentCustomer) {
          console.log('You cannot transfer to yourself');
          return;
        }
        await atm.transfer(args[0], parseFloat(args[1]));
        break;

      case 'logout':
        await atm.logout();
        break;

      case 'exit':
        rl.close();
        process.exit(0);
        break;

      default:
        console.log('Unknown command. Available commands: login, deposit, withdraw, transfer, logout, exit');
    }
  } catch (error) {
    console.log(error.message);
  }
}

const questionAsync = (query) => {
  return new Promise((resolve) => {
    rl.question(query, resolve);
  });
};


async function main() {
  console.log('Welcome to the ATM CLI');
  console.log('Available commands: login, deposit, withdraw, transfer, logout, exit');

  while (true) {
    const input = await questionAsync('Enter command: ');
    console.log('input ', input)
    await processCommand(input);
  }
}

main().catch(console.error);