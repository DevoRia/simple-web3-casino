// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract SimpleCasino {
    address public owner;
    uint256 public houseBalance;

    event Played(address indexed player, uint256 betAmount, bool win);

    constructor() {
        owner = msg.sender;
    }

    function play() external payable returns (bool) {
        require(msg.value > 0, "Bet amount must be greater than 0");
        require(houseBalance >= msg.value * 2, "Insufficient house balance");

        bool win = _randomWin();
        if (win) {
            uint256 prize = msg.value * 2;
            houseBalance -= prize;
            payable(msg.sender).transfer(prize);
        } else {
            houseBalance += msg.value;
        }

        emit Played(msg.sender, msg.value, win);
        return win;
    }

    function _randomWin() private view returns (bool) {
        uint256 randomNumber = uint256(keccak256(abi.encodePacked(block.timestamp, msg.sender))) % 37;
        return (randomNumber >= 1 && randomNumber <= 18);
    }

    function deposit() external payable {
        require(msg.value > 0, "Deposit amount must be greater than 0");
        houseBalance += msg.value;
    }

    function withdraw(uint256 amount) external {
        require(msg.sender == owner, "Only owner can withdraw");
        require(houseBalance >= amount, "Insufficient house balance");

        houseBalance -= amount;
        payable(msg.sender).transfer(amount);
    }

    function getHouseBalance() external view returns (uint256) {
        return houseBalance;
    }
}
