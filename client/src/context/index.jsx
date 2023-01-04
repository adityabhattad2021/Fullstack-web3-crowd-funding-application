import { useContext, createContext } from "react";
import {
	useAddress,
	useContract,
	useMetamask,
	useContractWrite,
	useContractRead,
} from "@thirdweb-dev/react";
import { ethers } from "ethers";

const StateContext = createContext();

export function StateContextProvider({ children }) {
	const { contract } = useContract(
		"0x2234AEdC22B178029B61647af8f31baF919A9d64"
	);

	const { mutateAsync: createCampaign } = useContractWrite(
		contract,
		"createCampaign"
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
		console.log(ethers.utils.parseEther(amount).toString());
		let data = null;
		try {
			data = await contract.call("donateToCampaign", campaignId, {
				value: ethers.utils.parseEther(amount).toString(),
			});
		} catch (error) {
			console.log("Contract call failed: ", error);
		}
		// const data=await contract.call('donateToCampaign',(campaignId+1).toString(),{ value: (ethers.utils.parseEther(amount)).toString() });

		return data;
	}

	async function withdrawETH(campaignId) {
		let data = null;
		try {
			data = await withdraw([campaignId]);
			console.log("contract call success: ", data);
		} catch (error) {
			console.log("Contract call failed: ", error);
		}
		return data;
	}

	async function refundETH(camapignId) {
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
		const campaigns = await contract.call("getCampaigns");
		const parsedCampaigns = campaigns.map((campaign) => {
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

	async function getCampaign(campaignId) {
		const campaign = await contract.call("getCampaign", campaignId);
		const parsedCampaign = {
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
		return parsedCampaign;
	}

	async function getUserCampaigns() {
		const allCampaigns = await getCampaigns();

		const filteredCampaigns = allCampaigns.filter(
			(campaign) => campaign.owner === address
		);

		return filteredCampaigns;
	}

	async function getSearchedCampaigns(searchTerm){
		const allCampaigns=await getCampaigns();
		if(searchTerm==""){
			return allCampaigns;
		}
		const filteredCampaigns=allCampaigns.filter(
			(campaign)=>(campaign.title).includes(searchTerm)
		)
		return filteredCampaigns;
	}

	async function getDonations(campaignId) {
		const donations = await contract.call("getDonators", campaignId);
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
				getSearchedCampaigns,
				publishCampaign,
				donate,
				withdrawETH,
				refundETH,
				getCampaign,
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
