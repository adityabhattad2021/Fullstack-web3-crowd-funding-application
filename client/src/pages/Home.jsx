import { useState, useEffect } from "react";
import { useStateContext } from "../context";

function Home() {

    const [isLoading,setIsLoading]=useState(false);
    const [campaigns,setCampaigns]=useState([]);

    const {address,contract}=useStateContext();


	return <div>Home</div>;
}

export default Home;
