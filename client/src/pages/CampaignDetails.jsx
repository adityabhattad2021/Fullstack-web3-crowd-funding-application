import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { ethers } from "ethers";

import { useStateContext } from "../context";
import { CountBox, CustomButton } from "../components";
import { calculateBarPercentage, daysLeft } from "../utils";
import { crowdFund, loader } from "../assets";

function CampaignDetails() {
	const { state } = useLocation();
	const { donate, getDonations, contract, address } = useStateContext();

	const [isLoading, setIsLoading] = useState(false);
	const [amount, setAmount] = useState("");
	const [donators, setDonators] = useState([]);

	const remainingDays = daysLeft(state.deadline);

	async function handleDonate() {
        setIsLoading(true)
        await donate(state.camapignId,amount)
        setIsLoading(false)
    }

    async function fetchDonators(){
        console.log(state);
        const data = await getDonations(state.camapignId);
        setDonators(data)
    }

    useEffect(()=>{
        if(contract){
            fetchDonators()
        }
    },[contract,address])

	return (
		<>
			{isLoading && (
				<div className="h-screen flex justify-center items-center">
					<img
						src={loader}
						alt="Loader"
						className="w-[100px] h-[100px] object-contain"
					/>
				</div>
			)}
			{!isLoading && (
				<>
					<div className="w-full flex md:flex-row flex-col mt-10 gap-[30px]">
						<div className="flex-1 flex-col">
							<img
								src={state.image}
								alt="campaign"
								className="w-full h-[410px] object-cover rounded-xl"
							/>
							<div className="mt-2 relative w-full h-[5px] bg-[#3a3a43]">
								<div
									className="absolute h-full bg-[#4acd8d]"
									style={{
										width: `${calculateBarPercentage(
											state.target,
											state.amountCollected
										)}%`,
										maxWidth: "100%",
									}}
								></div>
							</div>
						</div>
						<div className="flex md:w-[150px] w-full flex-wrap justify-between gap-[30px] lg:w-1/3">
							<CountBox title="Days Left" value={remainingDays} />
							<CountBox
								title={`Raised of ${state.target}`}
								value={state.amountCollected}
							/>
							<CountBox
								title="Total Backers"
								value={donators.length}
							/>
						</div>
					</div>
					<div className="mt-[60px] flex lg:flex-row flex-col gap-5">
						<div className="flex-[2] flex flex-col gap-[40px]">
							<div>
								<h4 className="font-epilogue font-semibold text-[18px] text-white uppercase">
									Creator
								</h4>
								<div className="mt-[20px] flex flex-row items-center flex-wrap gap-[14px]">
									<div className="w-[52px] h-[52px] flex items-center justify-center rounded-full bg-[#2c2f32] cursor-pointer">
										<img
											src={crowdFund}
											alt="user"
											className="w-[60%] h-[60%] object-contain"
										/>
									</div>
									<div>
										<h4 className="font-epilogue font-semibold text-[14px] text-white break-all">
											{state.owner}
										</h4>
									</div>
								</div>
							</div>
							<div>
								<h4 className="text-white font-epilogue font-semibold text-[18px]  uppercase">
									Story
								</h4>
								<div className="mt-[20px]">
									<p className="text-[#808191] font-epilogue font-normal text-[16px] leading-[26px] text-justify">
										{state.description}
									</p>
								</div>
							</div>
						</div>
						<div className="flex-1">
							<h4 className="font-epilogue font-semibold text-[18px] text-white uppercase">
								Fund
							</h4>
							<div className="mt-[20px] flex flex-col p-4 bg-[#1c1c24] rounded-[10px]">
								<p className="font-epilogue font-medium text-[20px] leading-[30px] text-center text-[#808191]">
									Fund The Campaign
								</p>
								<div className="mt-[30px]">
									<input
										type="number"
										placeholder="0.01 ETH"
										step="0.01"
										className="w-full py-[10px] sm:px-[20px] px-[15px]  outline-none border-[1px] border-[#3a3a43] bg-transparent font-epilogue text-white text-[18px] leading-[30px] placeholder:text-[#4b5264] rounded-[10px]"
										value={amount}
										onChange={(e) =>
											setAmount(e.target.value)
										}
									/>
								</div>
							</div>
							<CustomButton
								buttonType="button"
								title="Fund The Campaign"
								styles="w-full bg-[#4acd8d]"
								handleClick={handleDonate}
							/>
						</div>
					</div>
				</>
			)}
		</>
	);
}

export default CampaignDetails;
