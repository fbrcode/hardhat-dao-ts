import { ethers } from 'hardhat';
import { DeployFunction } from 'hardhat-deploy/types';
import { HardhatRuntimeEnvironment } from 'hardhat/types';
import verify from '../utils/verify';

const deployBox: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const contractName = 'Box';
  // @ts-ignore
  const { deployments, getNamedAccounts, network } = hre;
  const { deploy, log } = deployments;
  const { deployer } = await getNamedAccounts();
  // @ts-ignore
  const isLiveNetwork = network.live === true;
  const waitConfirmations = isLiveNetwork ? 5 : 1;
  log(
    `Deploying ${contractName} on ${network.name} which is ${
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
  const boxContract = await ethers.getContractAt(contractName, contract.address);

  // since the deployer has ownership right now, we need to give control to the governance process
  log(`Transferring ${contractName} ownership to the governance process...`);
  const timeLock = await ethers.getContract('TimeLock');
  const transferOwnerTx = await boxContract.transferOwnership(timeLock.address);
  await transferOwnerTx.wait(waitConfirmations);
  log(`Transfer complete!`);

  if (isLiveNetwork && process.env.ETHERSCAN_API_KEY) {
    log(`Verifying contract "${contract.address}" with args [${args}]...`);
    await verify(contract.address, args);
  }
  log(`----------------------------------------------------------`);
};

export default deployBox;
deployBox.tags = ['all', 'governance', 'box'];
