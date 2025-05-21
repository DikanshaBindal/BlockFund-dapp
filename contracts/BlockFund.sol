// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

contract BlockFund {
    struct Campaign {
        address payable creator;
        string title;
        string description;
        uint goal;
        uint raised;
        uint deadline;
        bool completed;
    }

    Campaign[] public campaigns;

    mapping(uint => address[]) public contributors;
    mapping(uint => mapping(address => uint)) public contributions;

    event CampaignCreated(uint campaignId, address creator);
    event Funded(uint campaignId, address funder, uint amount);

    function createCampaign(string memory _title, string memory _description, uint _goal, uint _duration) public {
        campaigns.push(Campaign(
            payable(msg.sender),
            _title,
            _description,
            _goal,
            0,
            block.timestamp + _duration,
            false
        ));
        emit CampaignCreated(campaigns.length - 1, msg.sender);
    }

    function fundCampaign(uint _id) public payable {
        Campaign storage campaign = campaigns[_id];
        require(block.timestamp < campaign.deadline, "Campaign expired");
        require(msg.value > 0, "Must send some Ether");
        campaign.raised += msg.value;
        contributors[_id].push(msg.sender);
        contributions[_id][msg.sender] += msg.value;
        emit Funded(_id, msg.sender, msg.value);
    }

    function withdraw(uint _id) public {
        Campaign storage campaign = campaigns[_id];
        require(msg.sender == campaign.creator, "Not creator");
        require(block.timestamp >= campaign.deadline, "Not finished yet");
        require(campaign.raised >= campaign.goal, "Goal not reached");
        require(!campaign.completed, "Already withdrawn");

        campaign.completed = true;
        campaign.creator.transfer(campaign.raised);
    }
}
