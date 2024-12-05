require("@nomiclabs/hardhat-waffle");
require("@nomiclabs/hardhat-ethers");
require("hardhat-deploy");
require("hardhat-contract-sizer");
require("hardhat-gas-reporter");

// Replace this private key with your Harmony account private key
// To export your private key from Metamask, open Metamask and
// go to Account Details > Export Private Key
// Be aware of NEVER putting real Ether into testing accounts
//const HARMONY_PRIVATE_KEY = "insert private key here";

module.exports = {
    solidity: {
        version: "0.8.4",
        optimizer: {
            enabled: true,
            runs: 200
        }
    },
    gasReporter: {
        enabled: true,
        currency: 'USD', // or your preferred currency
    },
    
    networks: {
        hardhat: {
            gas: 100000000,
            blockGasLimit: 0x1fffffffffffff,
            allowUnlimitedContractSize: true,
        }
    },
    namedAccounts: {
        deployer: 0,
    },
    paths: {
        deploy: "deploy",
        deployments: "deployments",
    },
    mocha: {
        timeout: 1000000
    }
};
