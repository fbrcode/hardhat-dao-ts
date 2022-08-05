import fs from 'fs';
// @ts-ignore
import { ethers, network } from 'hardhat';
import { moveBlocks } from '../utils/move-blocks';
import { moveTime } from '../utils/move-time';

const FUNCTION_NAME_TO_CALL = 'store';
const NEW_STORE_VALUE = 77;
const PROPOSAL_DESCRIPTION = 'Proposal #1: Store 77 in the Box!';
const MIN_DELAY = 3600; // 1 hour - after a vote passes, you have 1 hour before you can eject

// evaluate if the network is live or not (not = local blockchain)
// @ts-ignore
const isLiveNetwork = network.live === true;
const waitConfirmations = isLiveNetwork ? 5 : 1;

async function queueAndExecute(
  functionToCall: string,
  argumentsToPass: any[],
  proposalDescription: string
) {
  const box = await ethers.getContract('Box');
  const encodedFunctionCall = box.interface.encodeFunctionData(functionToCall, argumentsToPass);
  const descriptionHash = ethers.utils.keccak256(ethers.utils.toUtf8Bytes(proposalDescription));

  // queue
  const governor = await ethers.getContract('GovernorContract');
  console.log('Queuing proposal...');
  // Queue a proposal reference
  // https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/governance/extensions/GovernorTimelockControl.sol#L90
  const queueGovernorTx = await governor.queue(
    [box.address],
    [0],
    [encodedFunctionCall],
    descriptionHash
  );
  await queueGovernorTx.wait(waitConfirmations);

  // move time and blocks...
  console.log('Proposal queued. Waiting for blocks to move...');
  if (!isLiveNetwork) {
    await moveTime(MIN_DELAY + 1);
    await moveBlocks(1);
  }

  // execute
  console.log('Executing proposal...');
  // Execute a proposal reference
  // https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/governance/Governor.sol#L289
  const executeGovernorTx = await governor.execute(
    [box.address],
    [0],
    [encodedFunctionCall],
    descriptionHash
  );
  await executeGovernorTx.wait(waitConfirmations);

  // get the box new value
  const boxNewValue = await box.retrieve();
  console.log(`Box new value: ${boxNewValue}`);
}

queueAndExecute(FUNCTION_NAME_TO_CALL, [NEW_STORE_VALUE], PROPOSAL_DESCRIPTION)
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
