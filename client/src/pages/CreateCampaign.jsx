import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ethers } from "ethers";
import { useStateContext } from "../context";

import { money } from "../assets";
import { CustomButton, FormField, Loader } from "../components";
import { checkIfImage } from "../utils";

const initialForm = {
	name: "",
	title: "",
	description: "",
	target: "",
	deadline: "",
	image: "",
};

function CreateCampaign() {
	const navigate = useNavigate();
	const [isLoading, setIsLoading] = useState(false);
	const [form, setForm] = useState(initialForm);
	const { publishCampaign } = useStateContext();

	function handleFormFieldChange(fieldName, e) {
		setForm({ ...form, [fieldName]: e.target.value });
	}

	async function handleSubmit(event) {
		event.preventDefault();
		console.log(form);
		checkIfImage(form.image, async (exists) => {
			if (exists) {
				setIsLoading(true);
				await publishCampaign({
					...form,
					target: ethers.utils.parseUnits(form.target, 18),
				});
				setIsLoading(false);
				navigate("/");
			} else {
				alert("Provide a valid image URL");
				setForm({ ...form, image: "" });
			}
		});
	}

	return (
		<div className="bg-[#1c1c24] flex justify-center items-center flex-col rounded-[10px] sm:p-10 p-4">
			{isLoading ? (
				<Loader />
			) : (
				<>
					<div className="flex justify-center items-center p-[16px] sm:min-w-[380px] bg-[#3a3a43] rounded-[10px]">
						<h1 className="font-epilogue font-bold sm:text-[25px] text-[18px] leading-[38px] text-white">
							Start a Campaign
						</h1>
					</div>
					<form
						onSubmit={handleSubmit}
						className="w-full mt-[65px] flex flex-col gap-[30px]"
					>
						<div className="flex flex-wrap gap-[40px]">
							<FormField
								labelName="Your Name *"
								placeholder="Pushkar Phrabakar (a.k.a Indian Spiderman)"
								inputType="text"
								value={form.name}
								handleChange={(e) =>
									handleFormFieldChange("name", e)
								}
							/>
							<FormField
								labelName="Campaign Title *"
								placeholder="For Spiderman into the Spiderverse"
								inputType="text"
								value={form.title}
								handleChange={(e) =>
									handleFormFieldChange("title", e)
								}
							/>
						</div>
						<FormField
							labelName="Story *"
							placeholder="What's your story?"
							isTextArea
							value={form.description}
							handleChange={(e) =>
								handleFormFieldChange("description", e)
							}
						/>
						<div className="w-full flex justify-start items-center p-4 bg-[#4acd8d] h-[120px] rounded-[10px]">
							<img
								src={money}
								alt="money"
								className="w-[40px] h-[40px] object-contain"
							/>
							<h4 className="font-epilogue font-bold text-[25px] text-white ml-[20px]">
								You will get 99% of your raised amount.
							</h4>
						</div>

						<div className="flex flex-wrap gap-[40px]">
							<FormField
								labelName="Goal *"
								placeHolder="ETH 0.50"
								inputType="number"
								value={form.target}
								handleChange={(e) =>
									handleFormFieldChange("target", e)
								}
							/>
							<FormField
								labelName="End Date *"
								placeholder="End Data"
								inputType="date"
								value={form.deadline}
								handleChange={(e) =>
									handleFormFieldChange("deadline", e)
								}
							/>
						</div>
						<FormField
							labelName="Campaign Image *"
							placeholder="Place image URL for cover of your campaign here..."
							inputType="url"
							value={form.image}
							handleChange={(e) =>
								handleFormFieldChange("image", e)
							}
						/>
						<div className="flex justify-center items-center mt-[40px]">
							<CustomButton
								buttonType="submit"
								title="Submit a New Campaign"
								styles="bg-[#1dc071]"
							/>
						</div>
					</form>
				</>
			)}
		</div>
	);
}

export default CreateCampaign;
