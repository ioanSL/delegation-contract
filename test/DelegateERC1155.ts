import { loadFixture } from "@nomicfoundation/hardhat-toolbox/network-helpers";
import {expect} from "chai";
import {ethers} from "hardhat";

describe("Delegate ERC1155", async function () {
    async function deployDelegateFixture() {
        const [delegator, delegatee, user] = await ethers.getSigners();

        const Delegate = await ethers.getContractFactory("Delegate");
        const delegate = await Delegate.deploy();

        return {delegate, delegator, delegatee, user};
    }

    async function deployERC1155Fixture() {
        const [delegator, delegatee] = await ethers.getSigners();

        const ERC1155 = await ethers.getContractFactory("MockERC1155");
        const erc1155 = await ERC1155.deploy();
        await erc1155.mint(await delegator.getAddress(), 1, 100, ethers.encodeBytes32String("0x0"));

        return {erc1155, delegator, delegatee};
    }

    async function deployContract() {
        const Contract = await ethers.getContractFactory("MockContract");
        const contract = await Contract.deploy();

        return {contract};
    }

    describe ("Deployment", async function () {
        it("Should deploy the Delegate contract", async function () {
            const {delegate} = await loadFixture(deployDelegateFixture);
            const {erc1155} = await loadFixture(deployERC1155Fixture);

            expect(delegate.getAddress()).to.not.equal(0);
            expect(erc1155.getAddress()).to.not.equal(0);
        });

        it("Should delegate an ERC1155 contract", async function () {

            const { delegate, delegator, delegatee } = await loadFixture(deployDelegateFixture);
            const { erc1155 } = await loadFixture(deployERC1155Fixture);
            const owner = await erc1155.balanceOf(await delegator.getAddress(), 1);
            expect(owner).to.equal(100);

            await delegate.connect(delegator).delegateERC1155(
                    delegatee,
                    erc1155.getAddress(),
                    1,
                    100,
                    ethers.encodeBytes32String("license to code"),
                    true
                );

            const delegateStatus = await delegate.checkDelegateERC1155(
                    delegator, 
                    delegatee, 
                    erc1155.getAddress(), 
                    1, 
                    100,
                    ethers.encodeBytes32String("license to code")
                );
            expect(delegateStatus).to.equal(true);
        });

        it("Should delegate an ERC1155 contract with a range", async function () {

            const { delegate, delegator, delegatee } = await loadFixture(deployDelegateFixture);
            const { erc1155 } = await loadFixture(deployERC1155Fixture);
            const owner = await erc1155.balanceOf(await delegator.getAddress(), 1);
            expect(owner).to.equal(100);

            await delegate.connect(delegator).delegateERC1155(
                    delegatee,
                    erc1155.getAddress(),
                    1,
                    50,
                    ethers.encodeBytes32String("license to code"),
                    true
                );

            const delegateStatus = await delegate.checkDelegateERC1155(
                    delegator, 
                    delegatee, 
                    erc1155.getAddress(), 
                    1, 
                    50,
                    ethers.encodeBytes32String("license to code")
                );
            expect(delegateStatus).to.equal(true);
        });

        it("Should delegate an ERC1155 contract and revoke it", async function () {
                
            const { delegate, delegator, delegatee } = await loadFixture(deployDelegateFixture);
            const { erc1155 } = await loadFixture(deployERC1155Fixture);
            const owner = await erc1155.balanceOf(await delegator.getAddress(), 1);
            expect(owner).to.equal(100);

            await delegate.connect(delegator).delegateERC1155(
                    delegatee,
                    erc1155.getAddress(),
                    1,
                    100,
                    ethers.encodeBytes32String("license to code"),
                    true
                );

            const delegateStatus = await delegate.checkDelegateERC1155(
                    delegator, 
                    delegatee, 
                    erc1155.getAddress(), 
                    1, 
                    100,
                    ethers.encodeBytes32String("license to code")
                );
            expect(delegateStatus).to.equal(true);

            await delegate.connect(delegator).delegateERC1155(
                    delegatee,
                    erc1155.getAddress(),
                    1,
                    100,
                    ethers.encodeBytes32String("license to code"),
                    false
                );

            const delegateStatus2 = await delegate.checkDelegateERC1155(
                    delegator, 
                    delegatee, 
                    erc1155.getAddress(), 
                    1, 
                    100,
                    ethers.encodeBytes32String("license to code")
                );
            expect(delegateStatus2).to.equal(false);
        });

        it("Should not be able to delegate if not the owner", async function () {
            const { delegate, delegator, delegatee, user } = await loadFixture(deployDelegateFixture);
            const { erc1155 } = await loadFixture(deployERC1155Fixture);

            await expect(delegate.connect(user).delegateERC1155(
                delegatee,
                erc1155.getAddress(),
                1,
                100,
                ethers.encodeBytes32String("license to code"),
                true
            )).to.be.revertedWith("Sender does not have enough balance or is not the owner of the token");
        });

        it("Should delegate an invalid ERC1155 contract", async function () {
            const { delegate, delegator, delegatee } = await loadFixture(deployDelegateFixture);
            const { contract } = await loadFixture(deployContract);

            await expect(delegate.connect(delegator).delegateERC1155(
                delegatee,
                contract.getAddress(),
                1,
                100,
                ethers.encodeBytes32String("license to code"),
                true
            )).to.be.revertedWith("Asset is not an ERC1155 contract");
        });
    });
});