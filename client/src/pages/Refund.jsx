import { useState } from "react";
import { crowdFund, loader } from "../assets";
import { CustomButton } from "../components";
import { useStateContext } from "../context";

function RefundFunds() {
	const { address, refundETH } = useStateContext();
	const [campaignId, setCampaignId] = useState();
	const [isLoading, setIsLoading] = useState(false);

	async function handleRefund() {
		setIsLoading(true);
		await refundETH(campaignId);
		setIsLoading(false);
	}

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
				<div>
					<div className="flex-[2] flex flex-col gap-[40px]">
						<div>
							<h4 className="font-epilogue font-semibold text-[18px] text-white uppercase">
								your account
							</h4>
							<div className="mt-[20px] flex flex-row items-center flex-wrap gap-[14px]">
								<div className="w-[52px] h-[52px] flex items-center justify-center rounded-full bg-[#2c2f32] cursor-pointer">
									<img
										src={crowdFund}
										alt="user"
										className="w-[100%] h-[100%] object-contain"
									/>
								</div>
								<div>
									<h4 className="font-epilogue font-semibold text-[14px] text-white break-all">
										{address
											? address
											: "No Account Connected"}
									</h4>
								</div>
							</div>
						</div>
					</div>
					<div className="flex-1 mt-10">
						<h4 className="font-epilogue font-semibold text-[18px] text-white uppercase mb-5">
							Refund 
						</h4>
						<div className="mt-[30px] mb-[30px]">
							<input
								type="text"
								placeholder="Enter the campaign Id, to Initiate refund."
								className="w-full py-[10px] sm:px-[20px] px-[15px]  outline-none border-[1px] border-[#3a3a43] bg-transparent font-epilogue text-white text-[18px] leading-[30px] placeholder:text-[#4b5264] rounded-[10px]"
								value={campaignId}
								onChange={(e) => setCampaignId(e.target.value)}
							/>
						</div>
						<CustomButton
							buttonType="button"
							title="Refund"
							styles="w-full bg-[#4acd8d]"
							handleClick={handleRefund}
						/>
					</div>
				</div>
			)}
		</>
	);
}

export default RefundFunds;
