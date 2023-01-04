import {
	createCampaign,
	dashboard,
	logout,
	payment,
	profile,
	withdraw,
} from "../assets";

export const navLinks = [
	{
		name: "dashboard",
		imageURL: dashboard,
		link: "/",
	},
	{
		name: "campaign",
		imageURL: createCampaign,
		link: "/create-campaign",
	},
	{
		name: "payment",
		imageURL: payment,
		link: "/",
		disabled: true,
	},
	{
		name: "withdraw",
		imageURL: withdraw,
		link: "/withdraw",
	},
	{
		name: "profile",
		imageURL: profile,
		link: "/profile",
	},
	{
		name: "logout",
		imageURL: logout,
		link: "/",
		disabled: true,
	},
];
