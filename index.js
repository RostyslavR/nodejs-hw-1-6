const contacts = require("./contacts");
const { Command } = require("commander");
const program = new Command();
require("colors");

const actions = ["list", "get", "add", "remove", "restore"];

program
  .option("-a, --action <type>", "choose action")
  .option("-i, --id <type>", "user id")
  .option("-n, --name <type>", "user name")
  .option("-e, --email <type>", "user email")
  .option("-p, --phone <type>", "user phone");

program.parse(process.argv);

const argv = program.opts();

async function invokeAction({
  action = "list",
  id = "0",
  name = "onlyName",
  email = "on@on.ua",
  phone = "252525-225",
}) {
  switch (action) {
    case actions[0]:
      const list = await contacts.listContacts();
      if (!list) {
        throw new Error(`Sorry, I don't have contacts`);
      }
      console.table(list);
      break;

    case actions[1]:
      const contact = await contacts.getContactById(id);
      if (!contact) {
        throw new Error(`Sorry, I don't have contact with id ${id}`);
      }
      console.table([contact]);
      break;

    case actions[2]:
      const newContact = await contacts.addContact(id, name, email, phone);
      if (!newContact) {
        throw new Error(`Sorry, I can't add contact with id ${id}`);
      }
      console.log(`Contact with id ${id}  is updated`);
      console.table([newContact]);
      break;

    case actions[3]:
      const remContact = await contacts.removeContact(id);
      if (!remContact) {
        throw new Error(`Sorry, I can't remove contact with id ${id}`);
      }
      console.log(`Contact with id ${id}  is removed`);
      console.table([remContact]);
      break;

    case actions[4]:
      contacts.restoreContacts();
      console.log("db is restored");
      break;

    default:
      console.warn(" Unknown action type!".red);
      console.log("You can use : -a <action>");
      console.log("Actions:".green);
      actions.map((act) => console.log(act));
  }
}

invokeAction(argv);
