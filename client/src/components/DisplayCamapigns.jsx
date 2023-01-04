import { useNavigate } from "react-router-dom";

import { loader } from "../assets";
import { FundCard } from "../components";

function DisplayCampaigns({ title, isLoading, campaigns }) {
	const navigate = useNavigate();

	function handleNavigate(campaign) {
		navigate(`/campaign-details/${campaign.title}`, { state: campaign });
	}

	return (
		<div className="">
			<h1 className="font-epilogue font-semibold text-[18px] text-white text-left">
				{title} ({campaigns.length})
			</h1>

			<div className="flex flex-wrap mt-[20px] gap-[26px]">
				{isLoading && (
					<img
						src={loader}
						alt="Loader"
						className="w-[100px] h-[100px] object-contain"
					/>
				)}
				{!isLoading && campaigns.length === 0 && (
					<p className="font-epilogue font-semibold text-[14px] leading-[30px] text-[#818183] ">
						No campaign found
					</p>
				)}
				{!isLoading &&
					campaigns.length > 0 &&
					campaigns.map((campaign) => (
						<FundCard
							key={campaign.campaignId}
							{...campaign}
							handleClick={() => handleNavigate(campaign)}
						/>
					))}
			</div>
		</div>
	);
}

export default DisplayCampaigns;
