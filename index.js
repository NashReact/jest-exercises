import ghUser from 'github-current-user';
import prompt from 'prompt';
import chalk from 'chalk';
import ncp from 'ncp';
import path from 'path';

console.log(chalk.blue('Creating user exercise folder...'));

const getUsername = () => {
  const username = ghUser.current((err, username) => {
    if (err || !username) {
      return 'unknown';
    }
    return username;
  });
  return username;
};

const createUserCopy = ({ username }) => {
  ncp(path.resolve('./exercises'), username, function (err) {
    if (err) {
      console.log(chalk.red('Unable to create user specific copy.'));
      return console.log(err);
    }
    console.log(chalk.blue(`Your personal copy of the exercises in a newly created folder(${username}).`));
  });
}

const run = async() => {
  const username = await getUsername();
  const schema = {
    properties: {
      username: {
        default: username,
        pattern: /^[A-Za-z0-9_-]{3,15}$/,
        message: 'Name must be only letters, numbers, underscores, or dashes',
      },
    },
  };

  prompt.start();

  prompt.get(schema, (err, results) => {
    if (err) {
      console.log(chalk.red('Failed to determine folder to create.'));
      console.log(err);
      process.exit(1);
      return 1;
    }
    createUserCopy(results);
  });
};

run();
