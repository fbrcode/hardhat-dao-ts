import 'dotenv/config';

import '@nomiclabs/hardhat-etherscan';
import '@nomiclabs/hardhat-waffle';
import 'hardhat-gas-reporter';
import 'solidity-coverage';
import 'hardhat-deploy';

import '@nomiclabs/hardhat-ethers';
import '@typechain/hardhat';

import { HardhatUserConfig } from 'hardhat/config';
import { count } from 'console';

// get env variables with fallback options
const RINKEBY_RPC_URL = process.env.RINKEBY_RPC_URL || 'https://eth-rinkeby';
const PRIVATE_KEY = process.env.PRIVATE_KEY || '0xKey';
const ETHERSCAN_API_KEY = process.env.ETHERSCAN_API_KEY || 'key';
const COINMARKETCAP_API_KEY = process.env.COINMARKETCAP_API_KEY || 'key';

const config: HardhatUserConfig = {
  solidity: {
    compilers: [{ version: '0.8.7' }],
  },
  defaultNetwork: 'hardhat',
  networks: {
    localhost: {
      live: false,
      saveDeployments: true,
      chainId: 31337,
      tags: ['local'],
    },
    hardhat: {
      live: false,
      saveDeployments: true,
      chainId: 31337,
      tags: ['test', 'local'],
      accounts: {
        mnemonic: 'test test test test test test test test test test test junk',
        count: 5,
      },
      // forking: { url: MAINNET_RPC_URL, },
    },
    rinkeby: {
      live: true,
      saveDeployments: true,
      url: RINKEBY_RPC_URL,
      chainId: 4,
      accounts: [PRIVATE_KEY],
      tags: ['staging'],
    },
  },
  typechain: {
    outDir: 'typechain',
  },
  gasReporter: {
    enabled: true,
    outputFile: 'gas-reporter.log',
    noColors: true,
    currency: 'USD',
    coinmarketcap: COINMARKETCAP_API_KEY,
    token: 'ETH', // how much it costs to deploy/run on ethereum
    // token: "MATIC", // how much it costs to deploy/run on polygon
  },
  etherscan: {
    // yarn hardhat verify --network <NETWORK> <CONTRACT_ADDRESS> <CONSTRUCTOR_PARAMETERS>
    apiKey: ETHERSCAN_API_KEY,
  },
  namedAccounts: {
    deployer: {
      default: 0, // here this will by default take the first account as deployer
      1: 0, // similarly on mainnet it will take the first account as deployer. Note though that depending on how hardhat network are configured, the account 0 on one network can be different than on another
    },
  },
  mocha: {
    timeout: 900000, // 900 seconds max
  },
};

export default config;
