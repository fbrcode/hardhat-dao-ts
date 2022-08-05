import { DeployFunction } from 'hardhat-deploy/types';
import { HardhatRuntimeEnvironment } from 'hardhat/types';
// @ts-ignore
import { ethers } from 'hardhat';

import verify from '../utils/verify';
const contractName = 'GovernanceToken';
let waitConfirmations: number;

const deployGovernanceToken: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  // @ts-ignore
  const { deployments, getNamedAccounts, network } = hre;
  const { deploy, log } = deployments;
  const { deployer } = await getNamedAccounts();
  // @ts-ignore
  const isLiveNetwork = network.live === true;
  waitConfirmations = isLiveNetwork ? 5 : 1;
  log(
    `Deploying ${contractName} on ${network.name} which is ${
      // @ts-ignore
      !isLiveNetwork ? 'not' : ''
    } live network (wait confirmations: ${waitConfirmations})...`
  );

  const args: any[] = [];
  const contract = await deploy(contractName, {
    from: deployer,
    args: [],
    log: true,
    waitConfirmations: waitConfirmations,
  });

  // @ts-ignore
  if (isLiveNetwork && process.env.ETHERSCAN_API_KEY) {
    log(`Verifying contract "${contract.address}" with args [${args}]...`);
    await verify(contract.address, args);
  }
  log(`----------------------------------------------------------`);

  // delegate to the deployer
  await delegate(contract.address, deployer, log);
  log(`Delegated!`);
  log(`----------------------------------------------------------`);
};

const delegate = async (governanceTokenAddress: string, delegateAccount: string, log: any) => {
  const governanceToken = await ethers.getContractAt(contractName, governanceTokenAddress);
  const tx = await governanceToken.delegate(delegateAccount);
  await tx.wait(waitConfirmations);
  const numCheckpoints = await governanceToken.numCheckpoints(delegateAccount);
  log(`Checkpoints: ${numCheckpoints}`);
};

export default deployGovernanceToken;
deployGovernanceToken.tags = ['all', 'governance', 'token'];
