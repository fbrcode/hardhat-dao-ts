import fs from 'fs';
// @ts-ignore
import { ethers, network, deployments, getNamedAccounts } from 'hardhat';
import { moveBlocks } from '../utils/move-blocks';

const FUNCTION_NAME_TO_CALL = 'store';
const NEW_STORE_VALUE = 77;
const PROPOSAL_DESCRIPTION = 'Proposal #1: Store 77 in the Box!';
const VOTING_DELAY = 1; // 1 block

const proposalsFile = 'proposals.json';

// evaluate if the network is live or not (not = local blockchain)
// @ts-ignore
const isLiveNetwork = network.live === true;
const waitConfirmations = isLiveNetwork ? 5 : 1;

async function propose(
  functionToCall: string,
  argumentsToPass: any[],
  proposalDescription: string
) {
  // Get contracts
  const governor = await ethers.getContract('GovernorContract');
  const box = await ethers.getContract('Box');

  // Reference: https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/governance/Governor.sol#L245
  // To propose we (function parameters)...
  // 1. pick a list of targets, just Box contract in our case
  // 2. select values (how much ETH we want to send), we are not sending anything in our case
  // 3. calldata are the encoded function with parameters for what we want to call
  // 4. the description for the proposal

  // first we need to encode all the function parameters
  const encodedFunctionCall = box.interface.encodeFunctionData(functionToCall, argumentsToPass);
  // console.log(encodedFunctionCall);
  console.log(`Proposing ${functionToCall} on ${box.address} with ${argumentsToPass}`);
  console.log(`Proposal description: ${proposalDescription}`);
  const proposeTx = await governor.propose(
    [box.address], // targets
    [0], // values
    [encodedFunctionCall], // calldata
    proposalDescription // description
  );
  const proposeReceipt = await proposeTx.wait(waitConfirmations);

  // move time ahead to the voting period
  if (!isLiveNetwork) {
    await moveBlocks(VOTING_DELAY + 1);
  }

  // get proposal id from the event emitted and captured in the receipt
  const chainId = network.config.chainId === undefined ? 31337 : network.config.chainId;
  console.log(`Processing on chain ${network.config.chainId}...`);
  const proposalId = proposeReceipt.events[0].args.proposalId;
  console.log(`Proposal id: ${proposalId}`);
  let proposals = JSON.parse(fs.readFileSync(proposalsFile, 'utf8'));
  proposals[chainId.toString()].push(proposalId.toString());
  fs.writeFileSync(proposalsFile, JSON.stringify(proposals, null, 2));
  console.log(`Proposal id ${proposalId} added to ${proposalsFile}`);
}

propose(FUNCTION_NAME_TO_CALL, [NEW_STORE_VALUE], PROPOSAL_DESCRIPTION)
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
