import { useContract } from "@thirdweb-dev/react";
import { useState, useEffect } from "react";
import { DisplayCampaigns } from "../components";
import { useStateContext } from "../context";

function Profile() {
	const [isLoading, setIsLoading] = useState(false);
	const [campaigns, setCampaigns] = useState([]);

	const { address, getCampaigns } = useStateContext();
	const { contract } = useContract(
		"0x7f569Bd5fF6b3a5d261630CEB9623c976f5d0076"
	);

	async function fetchCampaigns() {
		setIsLoading(true);
		const data = await getCampaigns();
		setCampaigns(data);
		setIsLoading(false);
	}

    useEffect(()=>{
        if(contract){
            fetchCampaigns()
        }else{
            console.log("contract is not connected");
        }
    },[address,contract])

	return (
        <DisplayCampaigns
            title="Campaigns created by you"
            isLoading={isLoading}
            campaigns={campaigns}
        />
    );
}

export default Profile;
