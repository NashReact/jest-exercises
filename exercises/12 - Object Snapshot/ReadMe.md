# Object Snapshot

This exercise is set to setup your understanding of snapshots by implementing a `redux` reducer.

Snapshots are assertions values that are saved and updated using jest. 
Snapshots files are saved into a `__snapshots__` directory relative to the tests. 
To pass this exercise, you will need to open the `.snap` files to find the
expected values from the state tests.

## Setup
- Open terminal with this directory as the working directory
- Install dependencies
  - Run `yarn` or `npm install`
- Run `yarn test` or `npm test`
  - This will start jest in watch mode and notify mode
- Update `usersReducer`in [`index.spec.js`](index.spec.js) until tests pass