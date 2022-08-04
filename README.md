# Upgradable Contracts

## Init

- `git init`
- `yarn init -y`

## What we are going to do

Here is the rundown of what the test suite does.

1. We will deploy an ERC20 token that we will use to govern our DAO.
2. We will deploy a Timelock contract that we will use to give a buffer between executing proposals.
   1. Note: The timelock is the contract that will handle all the money, ownerships, etc
3. We will deploy our Governence contract
   1. Note: The Governance contract is in charge of proposals and such, but the Timelock executes!
4. We will deploy a simple Box contract, which will be owned by our governance process! (aka, our timelock contract).
5. We will propose a new value to be added to our Box contract.
6. We will then vote on that proposal.
7. We will then queue the proposal to be executed.
8. Then, we will execute it!

## Things to watch out

- Someone knows a hot proposal is coming up
  - So the buy a ton of tokens, and then they dump it after (we want to avoid this)
  - to avoid that we take an snapshot (checkpoint) of how many tokens people have at present time (block time)
