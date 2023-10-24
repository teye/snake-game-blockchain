# Snake Game Blockchain

This is a poc snake game that features NFT and leaderboard stored on Sepolia Testnet.

### Instructions

The game requires you to own a Snake NFT. Instructions are found within the game UI.

You would also need Sepolia ETH.

### Project Info

NFT metadata are uploaded on [IPFS](https://lavender-eligible-mosquito-391.mypinata.cloud/ipfs/QmWQfrtKz3koNRkV1EJgM7VJ2kzJ3yummMBUNRXDKRt8dp/)

NFT Contract: [0xB3a54BeBd28838c303c44f8fD7E1E5c7560a11F5](https://sepolia.etherscan.io/address/0xB3a54BeBd28838c303c44f8fD7E1E5c7560a11F5)

Leaderboard Contract: [0x2f65d1142fB7577D8DE00fDA4De4a6A33e6CdD56](https://sepolia.etherscan.io/address/0x2f65d1142fB7577D8DE00fDA4De4a6A33e6CdD56)

### Import NFT to Metamask

You may import the NFT into your Metamask wallet.

On Metamask, enable `Opensea API`. `Settings > Security & Privacy > Enable OpenSea API`.

Go to your wallet, `NFTs` tab, scroll down and `Import NFT`, type in the NFT Contract address and your token ID. You may retrieve them these two information in the game.

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

Snake image is generated by [Canva](https://www.canva.com/ai-image-generator/)
