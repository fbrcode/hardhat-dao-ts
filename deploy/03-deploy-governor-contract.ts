import { DeployFunction } from 'hardhat-deploy/types';
import { HardhatRuntimeEnvironment } from 'hardhat/types';

import verify from '../utils/verify';

const VOTING_DELAY = 1; // 1 block
const VOTING_PERIOD = 5; // 5 blocks
const QUORUM_PERCENTAGE = 4; // 4%

const deployGovernorContract: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const contractName = 'GovernorContract';
  // @ts-ignore
  const { deployments, getNamedAccounts, network } = hre;
  const { deploy, log, get } = deployments;
  const { deployer } = await getNamedAccounts();
  const governanceToken = await get('GovernanceToken');
  const timeLock = await get('TimeLock');
  // @ts-ignore
  const isLiveNetwork = network.live === true;
  const waitConfirmations = isLiveNetwork ? 5 : 1;
  log(
    `Deploying ${contractName} on ${network.name} which is ${
      // @ts-ignore
      !isLiveNetwork ? 'not' : ''
    } live network (wait confirmations: ${waitConfirmations})...`
  );

  const args = [
    governanceToken.address,
    timeLock.address,
    VOTING_DELAY,
    VOTING_PERIOD,
    QUORUM_PERCENTAGE,
  ];
  const contract = await deploy(contractName, {
    from: deployer,
    args: args,
    log: true,
    waitConfirmations: waitConfirmations,
  });

  // @ts-ignore
  if (isLiveNetwork && process.env.ETHERSCAN_API_KEY) {
    log(`Verifying contract "${contract.address}" with args [${args}]...`);
    await verify(contract.address, args);
  }
  log(`----------------------------------------------------------`);
};

export default deployGovernorContract;
deployGovernorContract.tags = ['all', 'governance', 'governor'];
