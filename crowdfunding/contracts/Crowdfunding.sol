// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/utils/Counters.sol";

error CrowdFunding__WithdrawFailed();

contract CrowdFunding {

    using Counters for Counters.Counter;

    event CampaignCreated(
        uint256 indexed campaignId
    );
    event CampaignFunded(
        uint256 indexed campaignId,
        address indexed funder,
        uint256 amount
    );

    struct Campaign {
        address owner;
        string title;
        string description;
        uint256 target;
        uint256 deadline;
        uint256 amountCollected;
        string image;
        address[] donators;
        uint256[] donations;
    }

    mapping(uint256 => Campaign) public campaigns;
    Counters.Counter public campaignCounter;

    function createCampaign(
        address _owner,
        string memory _title,
        string memory _description,
        uint256 _target,
        uint256 _deadline,
        string memory _image
    ) public {
        require(
            _deadline > block.timestamp,
            "The deadline should be a date in the future"
        );
        require(
            bytes(_title).length > 0,
            "The title must be a non-empty string"
        );
        require(
            bytes(_description).length > 0,
            "The description must be a non-empty string"
        );
        require(_target > 0, "The target must be a positive integer");
        campaignCounter.increment();
        uint256 currentCampaignId = campaignCounter.current();
        Campaign storage campaign = campaigns[currentCampaignId];
        campaign.owner = _owner;
        campaign.title = _title;
        campaign.description = _description;
        campaign.target = _target;
        campaign.deadline = _deadline;
        campaign.image = _image;
        campaign.amountCollected = 0;

        emit CampaignCreated(currentCampaignId);
    }

    function donateToCampaign(uint256 _id) public payable {
        require(
            msg.value > 0,
            "You must send some Ether to donate to the campaign"
        );
        require(
            campaigns[_id].deadline > block.timestamp,
            "The campaign is over"
        );

        uint256 amount = msg.value;
        Campaign storage campaign = campaigns[_id];
        campaign.donators.push(msg.sender);
        campaign.donations.push(amount);
        campaign.amountCollected += amount;

        emit CampaignFunded(_id, msg.sender, amount);
    }

    function withdraw(uint256 _id) public {
        Campaign storage campaign = campaigns[_id];
        require(
            campaign.amountCollected >= campaign.target,
            "The campaign has not reached its target"
        );
        require(
            campaign.deadline < block.timestamp,
            "The campaign is still ongoing"
        );
        require(
            campaign.owner == msg.sender,
            "You are not the owner of the campaign"
        );
        uint256 toPay = campaign.amountCollected;
        campaign.amountCollected = 0;
        (bool success, ) = payable(msg.sender).call{value: toPay}("");
        if(!success) {
            campaign.amountCollected = toPay;
            revert CrowdFunding__WithdrawFailed();
        }
    }

    function refund(uint256 _id) public {
        Campaign storage campaign = campaigns[_id];
        require(
            campaign.amountCollected < campaign.target,
            "The campaign has reached its target"
        );
        require(
            campaign.deadline < block.timestamp,
            "The campaign is still ongoing"
        );
        uint256 campaignDonatorsLength = campaign.donators.length;
        for (uint256 i = 0; i < campaignDonatorsLength; i++) {
            if (campaign.donators[i] == msg.sender) {
                require(
                    campaign.donations[i] > 0,
                    "You have already been refunded"
                );
                campaign.donations[i] = 0;
                payable(msg.sender).transfer(campaign.donations[i]);
                break;
            }
        }
    }

    // getter functions
    function getDonators(
        uint256 _id
    ) public view returns (address[] memory, uint256[] memory) {
        return (campaigns[_id].donators, campaigns[_id].donations);
    }

    function getCampaigns() public view returns (Campaign[] memory) {
        uint256 numberOfCampaigns = campaignCounter.current() - 1;
        Campaign[] memory allCampaigns = new Campaign[](numberOfCampaigns);

        for (uint i = 0; i < numberOfCampaigns; i++) {
            Campaign memory item = campaigns[i];
            allCampaigns[i] = item;
        }
        return allCampaigns;
    }

    function getCampaign(uint256 camapignId) public view returns(Campaign memory){
        require(camapignId<=campaignCounter.current(),"Campaign does not exist");
        return campaigns[camapignId];
    }

    
}
