import fs from 'fs';
// @ts-ignore
import { ethers, network } from 'hardhat';

const INDEX = 0; // first proposal from the list of proposals
const proposalsFile = 'proposals.json';

async function check(proposalIndex: number) {
  const chainId = network.config.chainId === undefined ? 31337 : network.config.chainId;
  const proposals = JSON.parse(fs.readFileSync(proposalsFile, 'utf8'));
  const proposalId = proposals[chainId][proposalIndex];

  // get the proposal state from interface enum:
  // https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/governance/IGovernor.sol#L14
  // 0: Pending | 1: Active | 2: Canceled | 3: Defeated | 4: Succeeded | 5: Queued | 6: Expired | 7: Executed
  enum ProposalState {
    Pending,
    Active,
    Canceled,
    Defeated,
    Succeeded,
    Queued,
    Expired,
    Executed,
  }

  const governor = await ethers.getContract('GovernorContract');
  const proposalState = await governor.state(proposalId);
  console.log(
    `Proposal ${proposalId} state is: ${proposalState} [ ${ProposalState[proposalState]} ]`
  );
}

check(INDEX)
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
