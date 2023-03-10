import { useState, useEffect } from "react";
import { DisplayCampaigns } from "../components";
import { useStateContext } from "../context";

function Profile() {
	const [isLoading, setIsLoading] = useState(false);
	const [campaigns, setCampaigns] = useState([]);

	const { address, getUserCampaigns,contract } = useStateContext();


	async function fetchCampaigns() {
		setIsLoading(true);
		const data = await getUserCampaigns();
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
