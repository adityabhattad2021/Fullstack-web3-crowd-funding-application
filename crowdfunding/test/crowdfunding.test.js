const { assert, expect } = require("chai");
const { loadFixture } = require("@nomicfoundation/hardhat-network-helpers");
const { ethers, network } = require("hardhat");

describe("Crowd Funding Contract test scenario", async function () {
	async function deployCrowdFundingFixture() {
		const [deployer, user1] = await ethers.getSigners();
		const crowdFundingContractFactory = await ethers.getContractFactory(
			"CrowdFunding"
		);
		const crowdFundingContract = await crowdFundingContractFactory.deploy();
		return {
			user1,
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
				defaultTarget = ethers.utils.parseEther("1");
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
			it("Assign donation correctly", async function () {
				const campaignId = 1;
				const amountToDonate = "2";
				const transectionResponse = await fixture.crowdFundingContract
					.connect(fixture.user1)
					.donateToCampaign(campaignId, {
						value: ethers.utils.parseEther(amountToDonate),
					});
				await transectionResponse.wait(1);

				const campaign = await fixture.crowdFundingContract.getCampaign(
					campaignId
				);

				// console.log(parseInt(campaign.donations[0]),campaign.donators);
				const donations = campaign.donations;
				const donators = campaign.donators;
				let donatorFound = 0;
				for (let x = 0; x < donations.length; x++) {
					if (donators[x] == fixture.user1.address) {
						donatorFound = 1;
						assert.equal(
							parseInt(donations[x]),
							ethers.utils.parseEther(amountToDonate),
							"donation amount does not match"
						);
					}
				}
				assert.isTrue(Boolean(donatorFound), "donator not found");
			});
			it("Withdraws funds properly", async function () {
				const campaignId = 1;
				const amountToDonate = "2";
				const transectionResponse = await fixture.crowdFundingContract
					.connect(fixture.user1)
					.donateToCampaign(campaignId, {
						value: ethers.utils.parseEther(amountToDonate),
					});
				await transectionResponse.wait(1);
				const campaignBefore =
					await fixture.crowdFundingContract.getCampaign(campaignId);
				assert.equal(
					parseInt(campaignBefore.amountCollected),
					ethers.utils.parseEther(amountToDonate),
					"balance is not correct"
				);

				await network.provider.send("evm_increaseTime", [90000]); // 1 day + 1 hour
				await network.provider.send("evm_mine");

				const creatorBalanceBefore = await ethers.provider.getBalance(
					fixture.deployer.address
				);
				const withdrawResponse = await fixture.crowdFundingContract
					.connect(fixture.deployer)
					.withdraw(campaignId);
				await withdrawResponse.wait(1);
				const campaignAfter =
					await fixture.crowdFundingContract.getCampaign(campaignId);
				const creatorBalanceAfter = await ethers.provider.getBalance(
					fixture.deployer.address
				);

				assert.isTrue(
					parseInt(creatorBalanceAfter) > parseInt(creatorBalanceBefore),
					"creator balance is not increased"
				);
				assert.equal(
					parseInt(campaignAfter.amountCollected),
					0,
					"balance is not zero"
				);
			});
		});
	});
});
