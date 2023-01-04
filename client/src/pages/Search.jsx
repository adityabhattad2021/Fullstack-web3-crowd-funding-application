import { useState, useEffect } from "react";
import { DisplayCampaigns } from "../components";
import { useStateContext } from "../context";

function Search({searchTerm}) {
	const [isLoading, setIsLoading] = useState(false);
	const [campaigns, setCampaigns] = useState([]);

	const { address, getSearchedCampaigns,contract } = useStateContext();


	async function fetchCampaigns() {
		setIsLoading(true);
		const data = await getSearchedCampaigns(searchTerm);
		setCampaigns(data);
		setIsLoading(false);
	}

    useEffect(()=>{
        if(contract){
            fetchCampaigns()
        }else{
            console.log("contract is not connected");
        }
    },[searchTerm,contract,address])

	return (
        <DisplayCampaigns
            title="Campaigns"
            isLoading={isLoading}
            campaigns={campaigns}
        />
    );
}

export default Search;
