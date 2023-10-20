// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/access/Ownable.sol";

contract Leaderboard is Ownable {
    // lists top 10 users
    uint8 leaderboardLength = 10;

    // one to store all the score
    // one to store top 10
    mapping (address => uint64) public scoreboard;
    mapping (uint64 => Player) public leaderboard;

    constructor(address initialOwner)
        Ownable(initialOwner) {}
    
    // each player has a username and score
    struct Player {
        address player;
        uint64 score;
    }

    function addScore(address user, uint64 score) public onlyOwner() returns (bool) {
        uint64 previousScore = scoreboard[user];

        if (previousScore > score) {
            // player did not score higher than their previous score
            return false;
        } else {
            scoreboard[user] = score;
        }

        // if the score is too low, don't update
        if (leaderboard[leaderboardLength-1].score >= score) return false;

        // loop through the leaderboard
        for (uint8 i = 0; i < leaderboardLength; i++) {
            if (leaderboard[i].score < score) {
                // shift the leaderboard
                Player memory currentPlayer = leaderboard[i];
                for (uint8 j = i+1; j < leaderboardLength + 1; j++) {
                    Player memory nextPlayer = leaderboard[j];
                    leaderboard[j] = currentPlayer;
                    currentPlayer = nextPlayer;
                }

                // insert
                leaderboard[i] = Player({
                    player: user,
                    score: score
                });

                // delete last from list
                delete leaderboard[leaderboardLength];
                return true;
            }
        }
        return false;
    }
}