import { loadFixture } from "@nomicfoundation/hardhat-toolbox/network-helpers";
import {expect} from "chai";
import {ethers} from "hardhat";

describe("Delegate", async function () {
    async function deployDelegateFixture() {
        const [delegator, delegatee, user] = await ethers.getSigners();

        const Delegate = await ethers.getContractFactory("Delegate");
        const delegate = await Delegate.deploy();

        return {delegate, delegator, delegatee, user};
    }

    async function deployERC721Fixture() {
        const [delegator, delegatee] = await ethers.getSigners();

        const ERC721 = await ethers.getContractFactory("MockERC721");
        const erc721 = await ERC721.deploy();
        await erc721.mint(await delegator.getAddress(), 1);
    
        return {erc721, delegator, delegatee};
    }

    async function deployContract() {
        const Contract = await ethers.getContractFactory("MockContract");
        const contract = await Contract.deploy();

        return {contract};
    }

    describe ("Deployment", async function () {
        it("Should deploy the Delegate contract", async function () {
            const {delegate} = await loadFixture(deployDelegateFixture);
            const {erc721} = await loadFixture(deployERC721Fixture);

            expect(delegate.getAddress()).to.not.equal(0);
            expect(erc721.getAddress()).to.not.equal(0);
        });

        it("Should delegate an ERC721 contract", async function () {
            const { delegate, delegator, delegatee } = await loadFixture(deployDelegateFixture);
            const { erc721 } = await loadFixture(deployERC721Fixture);
            const owner = await erc721.ownerOf(1);
            expect(owner).to.equal(await delegator.getAddress());

            await delegate.connect(delegator).delegate(
                    delegatee,
                    erc721.getAddress(),
                    1,
                    ethers.encodeBytes32String("license to code")
                );

            const delegateStatus = await delegate.checkDelegate(
                    delegator, 
                    delegatee, 
                    erc721.getAddress(), 
                    1, 
                    ethers.encodeBytes32String("license to code")
                );
            expect(delegateStatus).to.equal(true);
        });

        it("Should not delegate an ERC721 contract if not an ERC721", async function () {
            const { delegate, delegator, delegatee } = await loadFixture(deployDelegateFixture);
            const { contract } = await loadFixture(deployContract);

            await expect(delegate.connect(delegatee).delegate(
                    delegatee,
                    contract.getAddress(),
                    2,
                    ethers.encodeBytes32String("license to code")
                )).to.be.revertedWith("Receiver is not an ERC721 contract");
        });

        it("Should not be able to delegate twice", async function () {  
            const { delegate, delegator, delegatee } = await loadFixture(deployDelegateFixture);
            const { erc721 } = await loadFixture(deployERC721Fixture);

            await delegate.connect(delegator).delegate(
                delegatee,
                erc721.getAddress(),
                1,
                ethers.encodeBytes32String("license to code")
            );

            await expect(delegate.connect(delegator).delegate(
                delegatee,
                erc721.getAddress(),
                1,
                ethers.encodeBytes32String("license to code")
            )).to.be.revertedWith("Receiver already has a delegation");
        });

        it("Should not be able to delegate if not the owner", async function () {
            const { delegate, delegator, delegatee, user } = await loadFixture(deployDelegateFixture);
            const { erc721 } = await loadFixture(deployERC721Fixture);

            await expect(delegate.connect(user).delegate(
                delegatee,
                erc721.getAddress(),
                1,
                ethers.encodeBytes32String("license to code")
            )).to.be.revertedWith("Sender is not the owner of the token");
        });
    });
});