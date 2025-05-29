// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

contract BlockFund {
    enum Status { Active, Successful, Failed, Withdrawn }

    struct Campaign {
        address payable creator;
        string title;
        string description;
        uint goal;
        uint raised;
        uint deadline;
        Status status;
        bool completed;
    }

    Campaign[] public campaigns;

    mapping(uint => address[]) public contributors;
    mapping(uint => mapping(address => uint)) public contributions;

    bool public paused;
    address public owner;

    uint public platformFee = 200; // 2% fee in basis points (200/10000)
    address payable public feeRecipient;

    event CampaignCreated(uint campaignId, address creator);
    event Funded(uint campaignId, address funder, uint amount);
    event RefundClaimed(uint campaignId, address contributor, uint amount);
    event CampaignStatusChanged(uint campaignId, Status newStatus);
    event Paused();
    event Unpaused();

    modifier onlyOwner() {
        require(msg.sender == owner, "Not owner");
        _;
    }

    modifier whenNotPaused() {
        require(!paused, "Contract is paused");
        _;
    }

    constructor() {
        owner = msg.sender;
        feeRecipient = payable(owner);
        paused = false;
    }

    function pause() public onlyOwner {
        paused = true;
        emit Paused();
    }

    function unpause() public onlyOwner {
        paused = false;
        emit Unpaused();
    }

    function createCampaign(
        string memory _title,
        string memory _description,
        uint _goal,
        uint _duration
    ) public {
        require(_goal > 0, "Goal must be greater than 0");
        require(_duration > 0, "Duration must be greater than 0");

        campaigns.push(
            Campaign({
                creator: payable(msg.sender),
                title: _title,
                description: _description,
                goal: _goal,
                raised: 0,
                deadline: block.timestamp + _duration,
                status: Status.Active,
                completed: false
            })
        );

        emit CampaignCreated(campaigns.length - 1, msg.sender);
    }

    function fundCampaign(uint _id) public payable whenNotPaused {
        require(_id < campaigns.length, "Invalid campaign id");

        Campaign storage campaign = campaigns[_id];

        require(campaign.status == Status.Active, "Campaign not active");
        require(block.timestamp < campaign.deadline, "Campaign expired");
        require(msg.value > 0, "Must send some Ether");

        if (contributions[_id][msg.sender] == 0) {
            contributors[_id].push(msg.sender);
        }

        campaign.raised += msg.value;
        contributions[_id][msg.sender] += msg.value;

        emit Funded(_id, msg.sender, msg.value);
    }

    function checkCampaignStatus(uint _id) public {
        require(_id < campaigns.length, "Invalid campaign id");

        Campaign storage campaign = campaigns[_id];

        if (block.timestamp >= campaign.deadline && campaign.status == Status.Active) {
            if (campaign.raised >= campaign.goal) {
                campaign.status = Status.Successful;
            } else {
                campaign.status = Status.Failed;
            }
            emit CampaignStatusChanged(_id, campaign.status);
        }
    }

    function withdraw(uint _id) public {
        require(_id < campaigns.length, "Invalid campaign id");

        Campaign storage campaign = campaigns[_id];

        require(msg.sender == campaign.creator, "Not creator");
        require(block.timestamp >= campaign.deadline, "Not finished yet");
        require(campaign.status == Status.Successful, "Campaign not successful");
        require(!campaign.completed, "Already withdrawn");

        campaign.completed = true;
        campaign.status = Status.Withdrawn;
        emit CampaignStatusChanged(_id, campaign.status);

        uint fee = (campaign.raised * platformFee) / 10000;
        uint payout = campaign.raised - fee;

        feeRecipient.transfer(fee);
        campaign.creator.transfer(payout);
    }

    function claimRefund(uint _id) public {
        require(_id < campaigns.length, "Invalid campaign id");

        Campaign storage campaign = campaigns[_id];

        require(block.timestamp >= campaign.deadline, "Campaign not ended");
        require(campaign.status == Status.Failed, "Campaign not failed");

        uint contributed = contributions[_id][msg.sender];
        require(contributed > 0, "No contributions to refund");

        contributions[_id][msg.sender] = 0;
        payable(msg.sender).transfer(contributed);

        emit RefundClaimed(_id, msg.sender, contributed);
    }

    // Getter functions for convenience

    function getCampaign(uint _id) public view returns (Campaign memory) {
        require(_id < campaigns.length, "Invalid campaign id");
        return campaigns[_id];
    }

    function getContributors(uint _id) public view returns (address[] memory) {
        require(_id < campaigns.length, "Invalid campaign id");
        return contributors[_id];
    }

    function getContribution(uint _id, address _contributor) public view returns (uint) {
        require(_id < campaigns.length, "Invalid campaign id");
        return contributions[_id][_contributor];
    }

    // Admin function to update platform fee (e.g., max 10%)
    function setPlatformFee(uint _fee) public onlyOwner {
        require(_fee <= 1000, "Fee too high"); // Max 10%
        platformFee = _fee;
    }

    // Admin function to change fee recipient
    function setFeeRecipient(address payable _recipient) public onlyOwner {
        require(_recipient != address(0), "Invalid address");
        feeRecipient = _recipient;
    }
}
