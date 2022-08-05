import { DeployFunction } from 'hardhat-deploy/types';
import { HardhatRuntimeEnvironment } from 'hardhat/types';

import verify from '../utils/verify';

const MIN_DELAY_MINUTES = 3600; // 1 hour

const deployTimeLock: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const contractName = 'TimeLock';
  // @ts-ignore
  const { deployments, getNamedAccounts, network } = hre;
  const { deploy, log } = deployments;
  const { deployer } = await getNamedAccounts();
  // @ts-ignore
  const isLiveNetwork = network.live === true;
  const waitConfirmations = isLiveNetwork ? 5 : 1;
  log(
    `Deploying ${contractName} on ${network.name} which is ${
      // @ts-ignore
      !isLiveNetwork ? 'not' : ''
    } live network (wait confirmations: ${waitConfirmations})...`
  );

  const args = [MIN_DELAY_MINUTES, [], []];
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

export default deployTimeLock;
deployTimeLock.tags = ['all', 'governance', 'timelock'];
