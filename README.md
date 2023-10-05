# Snake Game Blockchain

This is a poc snake game that features NFT and leaderboard stored on Automata Testnet.

### Instructions

The game requires you to own a Snake NFT. Instructions are found within the game UI.

You would also need Sepolia ETH.

### Project Info

NFT metadata are uploaded on [IPFS](https://lavender-eligible-mosquito-391.mypinata.cloud/ipfs/QmdE4FfLUhXsZd6yUh7HyEDFNQbkzjpY5MgAC7PYTFfvm3/)
NFT Contract: [0x27a9dE3e73dfe6F3dA833184Ed44E16b43985ccd](https://explorer.ata.network/address/0x27a9dE3e73dfe6F3dA833184Ed44E16b43985ccd)
Leaderboard Contract: [0x6d4Ab47f3d5a1f1A4347ef7ebf471cb5b39a3722](https://explorer.ata.network/address/0x6d4Ab47f3d5a1f1A4347ef7ebf471cb5b39a3722)

### Development

1. Deploy NFT contract
2. Deploy Leaderboard contract

3. Create a `.env` with these variables:

```
REACT_APP_LEADERBOARD_PK=<private_key used to deploy leaderboard contract in Step 2>
```

This private key is required for the frontend to update the score on behalf of the user.

4. Run `npm start`

### Project Structure

```
abis - contract ABI
components/canvasboard - main snake game UI
components/ranking - leaderboard UI
components/score - score and wallet display
contracts - NFT and leaderboard contract
metadata - NFT metadata for each of the snake
store/sagas - background event monitoring plugins to move snake and update score
store/blockchainSlice - used to trigger event to saga
store/gameSlice - store all game related data, e.g. score
store/nftSlice - store all nft related data, e.g. token ID
store/userSlice - store all user related data, e.g. wallet address
```

### References

Source code is referenced and modified from [here](https://www.freecodecamp.org/news/build-a-snake-game-with-react-redux-and-redux-sagas/)
