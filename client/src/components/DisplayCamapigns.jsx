import { useNavigate } from "react-router-dom";

import { loader } from "../assets";

function DisplayCampaigns({title,isLoading,campaigns}) {

    const navigate=useNavigate()

	return (
        <div className="flex justify-center">
            <h1 className="font-epilogue font-semibold text-[18px] text-white text-left">{title} ({campaigns.length})</h1>
        </div>
    );
}

export default DisplayCampaigns;
