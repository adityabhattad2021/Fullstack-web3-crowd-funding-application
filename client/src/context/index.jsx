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
            console.log("Contract Call Success",data);
		} catch (error) {
            console.log("There was an error while creating the contract",error);
        }
	}

	async function getCampaigns(){
		const campaigns=await contract.call('getCampaigns');
		const parsedCampaigns=campaigns.map((campaign,index)=>{
			return (
				{
					owner:campaign.owner,
					title:campaign.title,
					description:campaign.description,
					target:ethers.utils.formatEther(campaign.amountCollected.toString()),
					image:campaign.image,
					camapignId:index
				}
			)
		})
		console.log(parsedCampaigns);
		return campaigns
	}

    return (
        <StateContext.Provider
            value={{
                address,
                contract,
				connect,
				getCampaigns,
                publishCampaign
            }}
        >
            {children}
        </StateContext.Provider>
    )

}


export function useStateContext(){
    return useContext(StateContext);
}