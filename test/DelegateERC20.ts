import { loadFixture } from "@nomicfoundation/hardhat-toolbox/network-helpers";
import {expect} from "chai";
import {ethers} from "hardhat";

describe("Delegate ERC20", async function () {
    async function deployDelegateFixture() {
        const [delegator, delegatee, user] = await ethers.getSigners();

        const Delegate = await ethers.getContractFactory("Delegate");
        const delegate = await Delegate.deploy();

        return {delegate, delegator, delegatee, user};
    }

    async function deployERC20Fixture() {
        const [delegator, delegatee] = await ethers.getSigners();

        const ERC20 = await ethers.getContractFactory("MockERC20");
        const erc20 = await ERC20.deploy();
        await erc20.mint(await delegator.getAddress(), 100);

        return {erc20, delegator, delegatee};
    }

    async function deployContract() {
        const Contract = await ethers.getContractFactory("MockContract");
        const contract = await Contract.deploy();

        return {contract};
    }

    describe ("Deployment", async function () {
        it("Should deploy the Delegate contract", async function () {
            const {delegate} = await loadFixture(deployDelegateFixture);
            const {erc20} = await loadFixture(deployERC20Fixture);

            expect(delegate.getAddress()).to.not.equal(0);
            expect(erc20.getAddress()).to.not.equal(0);
        });

        it("Should delegate an ERC20 contract", async function () {
            const { delegate, delegator, delegatee } = await loadFixture(deployDelegateFixture);
            const { erc20 } = await loadFixture(deployERC20Fixture);
            const owner = await erc20.balanceOf(await delegator.getAddress());
            expect(owner).to.equal(100);

            await delegate.connect(delegator).delegateERC20(
                    delegatee,
                    erc20.getAddress(),
                    100,
                    ethers.encodeBytes32String("license to code"),
                    true
                );

            const delegateStatus = await delegate.checkDelegateERC20(
                    delegator, 
                    delegatee, 
                    erc20.getAddress(),
                    100,
                    ethers.encodeBytes32String("license to code")
                );
            expect(delegateStatus).to.equal(true);
        });

        it("Should delegate an ERC20 contract and revoke it", async function () {
            const { delegate, delegator, delegatee } = await loadFixture(deployDelegateFixture);
            const { erc20 } = await loadFixture(deployERC20Fixture);
            const owner = await erc20.balanceOf(await delegator.getAddress());
            expect(owner).to.equal(100);

            await delegate.connect(delegator).delegateERC20(
                    delegatee,
                    erc20.getAddress(),
                    100,
                    ethers.encodeBytes32String("license to code"),
                    true
                );

            const delegateStatus = await delegate.checkDelegateERC20(
                    delegator, 
                    delegatee, 
                    erc20.getAddress(), 
                    100,
                    ethers.encodeBytes32String("license to code")
                );
            expect(delegateStatus).to.equal(true);

            await delegate.connect(delegator).delegateERC20(
                    delegatee,
                    erc20.getAddress(),
                    100,
                    ethers.encodeBytes32String("license to code"),
                    false
                );

            const delegateStatus2 = await delegate.checkDelegateERC20(
                    delegator, 
                    delegatee, 
                    erc20.getAddress(), 
                    100,
                    ethers.encodeBytes32String("license to code")
                );
            expect(delegateStatus2).to.equal(false);
        });

        it("Should delegate with invalid amount", async function () {
            const { delegate, delegator, delegatee } = await loadFixture(deployDelegateFixture);
            const { erc20 } = await loadFixture(deployERC20Fixture);
            const owner = await erc20.balanceOf(await delegator.getAddress());
            expect(owner).to.equal(100);

            await expect(delegate.connect(delegator).delegateERC20(
                    delegatee,
                    erc20.getAddress(),
                    101,
                    ethers.encodeBytes32String("license to code"),
                    true
                )).to.be.revertedWith("Sender does not have enough balance");
        });
    });
});