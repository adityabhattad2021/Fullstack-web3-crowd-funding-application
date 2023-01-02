const { assert, expect } = require("chai");
const { loadFixture } = require("@nomicfoundation/hardhat-network-helpers");
const { ethers } = require("hardhat");

describe("Crowd Funding Contract test scenario", async function () {
	async function deployCrowdFundingFixture() {
		const [deployer] = await ethers.getSigners();
		const crowdFundingContractFactory = await ethers.getContractFactory(
			"CrowdFunding"
		);
		const crowdFundingContract = await crowdFundingContractFactory.deploy();
		return {
			deployer,
			crowdFundingContract,
		};
	}

	describe("Running Crowd Funding Scenario", function () {
		it("Creates a campaign properly.", async function () {
			const fixture = await loadFixture(deployCrowdFundingFixture);
			const defaultAccount = fixture.deployer.address;
			const defaultTitle = "Campaign title";
			const defaultDescription = "Campaign description";
			const defaultTarget = ethers.utils.parseEther("2");
			const defaultDeadline =
				(await ethers.provider.getBlock("latest")).timestamp + 86400; // 1 day in the future
			const defaultImage = "http://example.com/image.jpg";
			await expect(
				await fixture.crowdFundingContract
					.connect(fixture.deployer)
					.createCampaign(
						defaultAccount,
						defaultTitle,
						defaultDescription,
						defaultTarget,
						defaultDeadline,
						defaultImage
					)
			).to.emit(fixture.crowdFundingContract, "CampaignCreated");
		});
		describe("After campaign created", function () {
			let fixture,
				defaultAccount,
				defaultTitle,
				defaultDescription,
				defaultTarget,
				defaultDeadline,
				defaultImage;
			beforeEach(async function () {
				fixture = await loadFixture(deployCrowdFundingFixture);
				defaultAccount = fixture.deployer.address;
				defaultTitle = "Campaign title";
				defaultDescription = "Campaign description";
				defaultTarget = ethers.utils.parseEther("2");
				defaultDeadline =
					(await ethers.provider.getBlock("latest")).timestamp +
					86400; // 1 day in the future
				defaultImage = "http://example.com/image.jpg";
				tx = await fixture.crowdFundingContract
					.connect(fixture.deployer)
					.createCampaign(
						defaultAccount,
						defaultTitle,
						defaultDescription,
						defaultTarget,
						defaultDeadline,
						defaultImage
					);
				await tx.wait(1);
			});
			it("Assign all the values properly", async function () {
				const campaignId = 1;
				const campaign = await fixture.crowdFundingContract.getCampaign(
					campaignId
				);
				assert.equal(
					campaign.title,
					defaultTitle,
					"title does not match"
				);
				assert.equal(
					campaign.description,
					defaultDescription,
					"description does not match"
				);
				assert.equal(
					parseInt(campaign.target),
					parseInt(defaultTarget),
					"target does not match"
				);
				assert.equal(
					campaign.deadline,
					defaultDeadline,
					"deadline does not match"
				);
				assert.equal(
					campaign.image,
					defaultImage,
					"image does not match"
				);
			});
		});
	});
});
