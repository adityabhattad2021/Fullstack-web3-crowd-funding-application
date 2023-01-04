import { useContext, createContext } from "react";
import {
	useAddress,
	useContract,
	useMetamask,
	useContractWrite,
	useContractRead
} from "@thirdweb-dev/react";
import { ethers } from "ethers";

const StateContext = createContext();

export function StateContextProvider({ children }) {
	const { contract } = useContract(
		"0x615C68c3F69b495D0B14F4163770162D31E94C9b"
	);

	const { mutateAsync: createCampaign } = useContractWrite(
		contract,
		"createCampaign"
	);
	const { mutateAsync: donateToCampaign } = useContractWrite(
		contract,
		"donateToCampaign"
	);
	const { mutateAsync: withdraw } = useContractWrite(contract, "withdraw");
	const { mutateAsync: refund } = useContractWrite(contract, "refund");

	const address = useAddress();
	const connect = useMetamask();

	// Transection calls
	async function publishCampaign(form) {
		try {
			const data = await createCampaign([
				address,
				form.title,
				form.description,
				form.target,
				new Date(form.deadline).getTime(),
				form.image,
			]);
			console.log("Contract Call Success", data);
		} catch (error) {
			console.log(
				"There was an error while creating the contract",
				error
			);
		}
	}

	async function donate(campaignId, amount) {
		// console.log((ethers.utils.parseEther(amount)).toString());
		let data = null;
		try {
			data = await donateToCampaign([campaignId], {
				value: ethers.utils.parseEther(amount).toString(),
			});
		} catch (error) {
			console.log("Contract call failed: ", error);
		}
		// const data=await contract.call('donateToCampaign',(campaignId+1).toString(),{ value: (ethers.utils.parseEther(amount)).toString() });

		return data;
	}

	async function withdraw(campaignId) {
		let data = null;
		try {
			data = await withdraw([campaignId]);
			console.log("contract call success: ", data);
		} catch (error) {
			console.log("Contract call failed: ", error);
		}
		return data;
	}

	async function refund(camapignId) {
		let data = null;
		try {
			data = await refund([camapignId]);
			console.info("contract call successs", data);
		} catch (err) {
			console.error("contract call failure", err);
		}
		return data;
	}


	// Read functions
	async function getCampaigns() {
		const { data:campaigns } = useContractRead(contract, "getCampaigns")
		const parsedCampaigns = campaigns.map((campaign, index) => {
			return {
				owner: campaign.owner,
				title: campaign.title,
				description: campaign.description,
				target: ethers.utils.formatEther(campaign.target.toString()),
				deadline: campaign.deadline.toNumber(),
				amountCollected: ethers.utils.formatEther(
					campaign.amountCollected.toString()
				),
				image: campaign.image,
				campaignId: campaign.campaignId,
			};
		});
		console.log(parsedCampaigns);
		return parsedCampaigns;
	}

	async function getUserCampaigns() {
		const allCampaigns = await getCampaigns();

		const filteredCampaigns = allCampaigns.filter(
			(campaign) => campaign.owner === address
		);

		return filteredCampaigns;
	}

	async function getDonations(campaignId) {
		const { data:donations } = useContractRead(contract, "getDonators", campaignId)
		const numberofDonations = donations[0].length;
		const parsedDonations = [];

		for (let i = 0; i < numberofDonations; i++) {
			parsedDonations.push({
				donator: donations[0][i],
				doantions: ethers.utils.formatEther(donations[1][i].toString()),
			});
		}

		return parsedDonations;
	}

	return (
		<StateContext.Provider
			value={{
				address,
				contract,
				connect,
				getCampaigns,
				getUserCampaigns,
				publishCampaign,
				donate,
				withdraw,
				refund,
				getDonations,
			}}
		>
			{children}
		</StateContext.Provider>
	);
}

export function useStateContext() {
	return useContext(StateContext);
}
