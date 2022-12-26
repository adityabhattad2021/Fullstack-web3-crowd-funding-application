require("dotenv").config();

const GOERLI_RPC_URL = process.env.GOERLI_RPC_URL;
const PRIVATE_KEY = process.env.PRIVATE_KEY;

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
	solidity: {
		version: "0.8.17",
		settings: {
			optimizer: {
				enabled: true,
				runs: 200,
			},
		},
	},
	defaultNetwork: "goerli",
	networks: {
		hardhat: {
			chainId: 1337,
			blockConfirmations: 1,
		},
		localhost: {
			chainId: 1337,
			blockConfirmations: 1,
		},
		goerli: {
			chainId: 5,
			blockConfirmations: 6,
			url: GOERLI_RPC_URL,
			accounts: [PRIVATE_KEY],
		},
	},
	namedAccounts: {
		deployer: {
			default: 0,
		},
		user1: {
			default: 1,
		},
		user2: {
			default: 2,
		},
	},
};
