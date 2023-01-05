import { Route, Routes } from "react-router-dom";
import {
	Home,
	Profile,
	CreateCampaign,
	CampaignDetails,
	WithdrawFunds,
	Search,
	RefundFunds,
} from "./pages";
import { Sidebar, Navbar } from "./components";
import { useState } from "react";

function App() {
	const [searchTerm, setSearchTerm] = useState("");
	return (
		<div className="relative sm:-8 p-4 bg-[#13131a] min-h-screen flex flex-row">
			<div className="sm:flex hidden mr-10 relative">
				<Sidebar />
			</div>
			<div className="flex-1 max-sm:w-full max-w-[1280px] mx-auto sm:pr-5">
				<Navbar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
				<Routes>
					<Route path="/" element={<Home />} />
					<Route path="/profile" element={<Profile />} />
					<Route
						path="/create-campaign"
						element={<CreateCampaign />}
					/>
					<Route
						path="/campaign-details/:id"
						element={<CampaignDetails />}
					/>
					<Route path="/withdraw" element={<WithdrawFunds />} />
					<Route path="/refund" element={<RefundFunds/>} />
					<Route
						path="/search"
						element={<Search searchTerm={searchTerm} />}
					/>

				</Routes>
			</div>
		</div>
	);
}

export default App;
