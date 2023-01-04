import { useContract } from "@thirdweb-dev/react";
import { useState, useEffect } from "react";
import { DisplayCampaigns } from "../components";
import { useStateContext } from "../context";

function Home() {
	const [isLoading, setIsLoading] = useState(false);
	const [campaigns, setCampaigns] = useState([]);

	const { address, getCampaigns,contract } = useStateContext();
	

	async function fetchCampaigns() {
		setIsLoading(true);
		const data = await getCampaigns();
		setCampaigns(data);
		setIsLoading(false);
	}

	useEffect(() => {
		if (contract) {
			fetchCampaigns();
		} else {
			console.log("contract not connected.");
		}
	}, [address,contract]);

	return (
		<DisplayCampaigns
			title="All Campaigns"
			isLoading={isLoading}
			campaigns={campaigns}
		/>
	);
}

export default Home;
