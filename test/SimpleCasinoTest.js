const { expect } = require("chai");
const { BN, ether, expectEvent, expectRevert } = require("@openzeppelin/test-helpers");
const SimpleCasino = artifacts.require("SimpleCasino");

contract("SimpleCasino", (accounts) => {
    const [owner, player] = accounts;
    let simpleCasino;

    beforeEach(async () => {
        simpleCasino = await SimpleCasino.new({ from: owner });
    });

    it("should deploy the contract correctly", async () => {
        expect(simpleCasino.address).to.not.equal("");
    });

    it("should allow depositing Ether", async () => {
        const depositAmount = ether("1");
        await simpleCasino.deposit({ from: owner, value: depositAmount });

        const houseBalance = await web3.eth.getBalance(simpleCasino.address);
        expect(new BN(houseBalance)).to.be.bignumber.equal(depositAmount);
    });

    it("should allow playing the game", async () => {
        const depositAmount = ether("1");
        const betAmount = ether("0.1");
        await simpleCasino.deposit({ from: owner, value: depositAmount });

        const result = await simpleCasino.play({ from: player, value: betAmount });

        expectEvent(result, "Played", {
            player: player,
            betAmount: betAmount,
        });
    });

});
