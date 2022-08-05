import { DeployFunction } from 'hardhat-deploy/types';
import { HardhatRuntimeEnvironment } from 'hardhat/types';
// @ts-ignore
import { ethers } from 'hardhat';

const setupContracts: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  // @ts-ignore
  const { deployments, getNamedAccounts, network } = hre;
  const { log } = deployments;
  const { deployer } = await getNamedAccounts();
  const timeLock = await ethers.getContract('TimeLock', deployer);
  const governor = await ethers.getContract('GovernorContract', deployer);
  // @ts-ignore
  const isLiveNetwork = network.live === true;
  const waitConfirmations = isLiveNetwork ? 5 : 1;
  log(
    `Setting up roles on ${network.name} which is ${
      // @ts-ignore
      !isLiveNetwork ? 'not' : ''
    } live network (wait confirmations: ${waitConfirmations})...`
  );

  // roles..
  // governor: only "him/her" can send transactions to the time lock contract (the one which executes)
  const proposerRole = await timeLock.PROPOSER_ROLE();
  const executorRole = await timeLock.EXECUTOR_ROLE();
  const adminRole = await timeLock.TIMELOCK_ADMIN_ROLE();

  // setups roles..
  // governor: only "him/her" can send transactions to the time lock contract (the one which executes)
  const proposerTx = await timeLock.grantRole(proposerRole, governor.address);
  await proposerTx.wait(waitConfirmations);

  // we are giving the executor role to nobody (0x0) which means everybody
  const executorTx = await timeLock.grantRole(executorRole, ethers.constants.AddressZero);
  await executorTx.wait(waitConfirmations);

  // we need to revoke a role since the deployer owns the timelock control now that we gave everybody access
  const revokeTx = await timeLock.revokeRole(adminRole, deployer);
  await revokeTx.wait(waitConfirmations);

  // now everything has to go through governance, nobody owns the time controller anymore

  log(`Governance has been defined with decentralized power!`);
  log(`----------------------------------------------------------`);
};

export default setupContracts;
setupContracts.tags = ['all', 'governance', 'setup'];
