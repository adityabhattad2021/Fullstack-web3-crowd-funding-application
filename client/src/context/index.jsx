import { useContext, createContext } from "react";
import {
	useAddress,
	useContract,
	useMetamask,
	useContractWrite,
} from "@thirdweb-dev/react";
import { ethers } from "ethers";

const StateContext = createContext();

export function StateContextProvider({ children }) {
	const { contract } = useContract(
		"0x7f569Bd5fF6b3a5d261630CEB9623c976f5d0076"
	);

	const { mutateAsync: createCampaign } = useContractWrite(
		contract,
		"createCampaigns"
	);

	const address = useAddress();
	const connect = useMetamask();

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

	async function getCampaigns() {
		const campaigns = await contract.call("getCampaigns");
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
				camapignId: index,
			};
		});
		console.log(parsedCampaigns);
		return parsedCampaigns;
	}


	async function getUserCampaigns(){
		const allCampaigns=await getCampaigns()

		const filteredCampaigns=allCampaigns.filter((campaign)=>(campaign.owner===address))

		return filteredCampaigns
	}

	async function donate(campaignId,amount){
		console.log((ethers.utils.parseEther(amount)).toString());
		const data=await contract.call('donateToCampaign',(campaignId+1).toString(),{ value: (ethers.utils.parseEther(amount)).toString() });

		return data;
	}

	async function getDonations(campaignId){
		const donations=await contract.call("getDonators",campaignId)
		const numberofDonations=donations[0].length;
		const parsedDonations=[]

		for(let i=0;i<numberofDonations;i++){
			parsedDonations.push({
				donator:donations[0][i],
				doantions:ethers.utils.formatEther(donations[1][i].toString())
			})
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
				getDonations
			}}
		>
			{children}
		</StateContext.Provider>
	);
}

export function useStateContext() {
	return useContext(StateContext);
}
