import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { logo, sun } from "../assets";
import { navLinks } from "../constants";

function Icon({ styles, name, imageURL, isActive, disabled, handeClick }) {
	return (
		<div
			className={`w-[48px] h-[48px] rounded-[10px] ${
				isActive && isActive === name && "bg-[#2c2f32]"
			} flex justify-center items-center ${
				!disabled && "cursor-pointer"
			} ${styles} `}
			onClick={handeClick}
		>
			{!isActive ? (
				<img src={imageURL} alt="fund_logo" className="w-1/2 h-1/2" />
			) : (
				<img
					src={imageURL}
					alt="fund_logo"
					className={`w-1/2 h-1/2 ${
						isActive !== name && "grayscale"
					}`}
				/>
			)}
		</div>
	);
}

function Sidebar() {
	const navigate = useNavigate();
	const [isActive, setIsActive] = useState();

	return (
		<div className="flex justify-between items-center flex-col sticky top-5 h-[53vh]">
			<Link to="/">
				<Icon styles="w-[70px] h-[70px] bg-[#2c2f32]" imageURL={logo} />
			</Link>

			<div className="flex-1 flex flex-col justify-between items-center bg-[#1c1c24] rounded-[20px] w-[76px] py-4 mt-12">
				<div className="flex flex-col justify-center items-center gap-3">
					{navLinks.map((link) => (
						<Icon
							key={link.name}
							{...link}
							isActive={isActive}
							handeClick={() => {
								if (!link.disabled) {
									setIsActive(link.name);
									navigate(link.link);
								}
							}}
						/>
					))}
				</div>
			</div>
		</div>
	);
}

export default Sidebar;
