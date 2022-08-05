import fs from 'fs';
// @ts-ignore
import { ethers, network } from 'hardhat';
import { moveBlocks } from '../utils/move-blocks';

const INDEX = 0; // first proposal from the list of proposals
const proposalsFile = 'proposals.json';
const VOTING_PERIOD = 5; // 5 blocks

// evaluate if the network is live or not (not = local blockchain)
// @ts-ignore
const isLiveNetwork = network.live === true;
const waitConfirmations = isLiveNetwork ? 5 : 1;

async function vote(proposalIndex: number) {
  const chainId = network.config.chainId === undefined ? 31337 : network.config.chainId;
  const proposals = JSON.parse(fs.readFileSync(proposalsFile, 'utf8'));
  const proposalId = proposals[chainId][proposalIndex];
  // 0 - against (vote), 1 - for (vote), 2 - abstain (no vote)
  const voteWay = 1;
  const governor = await ethers.getContract('GovernorContract');
  const reason = 'I support this proposal';
  const voteTxResponse = await governor.castVoteWithReason(proposalId, voteWay, reason);
  await voteTxResponse.wait(waitConfirmations);

  if (!isLiveNetwork) {
    await moveBlocks(VOTING_PERIOD + 1);
  }
  console.log(`Voted on proposal ${proposalId}!`);
}

vote(INDEX)
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
