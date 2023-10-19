import Button from '@mui/material/Button';
import { ethers } from 'ethers';
import React, { useEffect, useState } from 'react';
import NFTABI from './abis/NFTABI.json';
import './App.css';
import CanvasBoard from './components/canvasboard';
import RankingBoard from './components/rankingboard';
import ScoreCard from './components/score';
import COMMON_SNAKE_DATA from './metadata/1.json';
import UNCOMMON_SNAKE_DATA from './metadata/2.json';
import RARE_SNAKE_DATA from './metadata/3.json';
import { useAppDispatch, useAppSelector } from './store/hooks';
import { UPDATE_RARITY, UPDATE_TOKEN_ID, UPDATE_TOKEN_URI } from './store/nftSlice';
import { UPDATE_BALANCE, UPDATE_IS_CONNECTED, UPDATE_NFT_BALANCE, UPDATE_WALLET } from './store/userSlice';
import { automataTestnet, GAME_HEIGHT, GAME_WIDTH, NFT_CONTRACT, shortenAddress } from './utils';
import { CircularProgress } from '@mui/material';

let signerProvider: ethers.providers.Web3Provider;

function App() {
  const dispatch = useAppDispatch();
  const userState = useAppSelector((state) => state.user);
  const gameState = useAppSelector((state) => state.game);
  const [isMinting, setIsMinting] = useState(false);

  const updateWalletBalance = (accounts: any) => {
    if (signerProvider && accounts.length) {
      signerProvider.getBalance(accounts[0]).then((result: any) => {
        const bal = ethers.utils.formatEther(result);
        dispatch(UPDATE_BALANCE(bal));
      });
    }
  };

  const mintNFT = async () => {
    if (!signerProvider) {
      return;
    }

    const signer = signerProvider.getSigner();
    const nftContract = new ethers.Contract(NFT_CONTRACT, NFTABI, signer);
    const mintTx = await nftContract.safeMint();
    const mintTxReceipt = await mintTx.wait();

    if (mintTxReceipt && mintTxReceipt.status === 1) {
      await fetchNFT(userState.wallet);
    }
  };

  const fetchNFT = async (wallet: string) => {
    let rpcProvider: ethers.providers.JsonRpcProvider = new ethers.providers.JsonRpcProvider(automataTestnet.rpc);
    const nftContract = new ethers.Contract(NFT_CONTRACT, NFTABI, rpcProvider);
    const nftBalance = await nftContract.balanceOf(wallet);

    if (nftBalance) {
      const tokenId = await nftContract.getTokenID(wallet);
      const tokenURI = await nftContract.tokenURI(tokenId);

      // read token URI and save nft info
      // should do this from a db or directly via IPFS
      // ipfs url is https://<gateway>/ipfs/<CID>/<num>.json
      const tokenURIArray = tokenURI.split('/');
      const lastPart = tokenURIArray[tokenURIArray.length - 1];
      let rarity;
      let json;

      if (lastPart === '3.json') {
        json = RARE_SNAKE_DATA;
      } else if (lastPart === '2.json') {
        json = UNCOMMON_SNAKE_DATA;
      } else {
        json = COMMON_SNAKE_DATA;
      }

      rarity = json.attributes[0].trait_type === 'Rarity' && json.attributes[0].value;

      console.log('token id: ', tokenId.toNumber());
      console.log('token uri: ', tokenURI);
      console.log('rarity: ', rarity);

      dispatch(UPDATE_NFT_BALANCE(nftBalance.toNumber()));
      dispatch(UPDATE_TOKEN_ID(tokenId.toNumber()));
      dispatch(UPDATE_TOKEN_URI(tokenURI));
      dispatch(UPDATE_RARITY(rarity));
    }
  };

  const onConnectWallet = () => {
    if (!window.ethereum) {
      console.log('Please install Metamask');
      return;
    }

    signerProvider = new ethers.providers.Web3Provider(window.ethereum);

    // MetaMask requires requesting permission to connect users accounts
    signerProvider
      .send('eth_requestAccounts', [])
      .then(async (accounts: any) => {
        if (accounts.length > 0) {
          try {
            await (signerProvider.provider as any).request({
              method: 'wallet_addEthereumChain',
              params: [
                {
                  chainId: automataTestnet.chainIdHex,
                  chainName: automataTestnet.name,
                  rpcUrls: [`${automataTestnet.rpc}`],
                  blockExplorerUrls: [`${automataTestnet.explorer}`],
                  nativeCurrency: {
                    symbol: automataTestnet.currency,
                    decimals: 18,
                  },
                },
              ],
            });

            const address = ethers.utils.getAddress(accounts[0]);

            await fetchNFT(address);
            dispatch(UPDATE_WALLET(address));
            dispatch(UPDATE_IS_CONNECTED(true));
            updateWalletBalance(accounts);
          } catch (err) {
            console.error(err);
          }
        }
      })
      .catch((e: any) => console.error(e));
  };

  const handleAccountsChanged = async (accounts: any) => {
    if (accounts.length === 0) {
      console.log('Please connect to Metamask');
    } else if (accounts[0].toLowerCase() !== userState.wallet.toLowerCase()) {
      const address = ethers.utils.getAddress(accounts[0]);
      await fetchNFT(address);
      dispatch(UPDATE_WALLET(address));
      updateWalletBalance(accounts);
    }
    setIsMinting(false);
  };

  useEffect(() => {
    window.ethereum.on('accountsChanged', handleAccountsChanged);
  }, []);

  return (
    <div className="App">
      {userState.isConnected ? (
        userState.nftBalance > 0 ? (
          <div className="mainBoardWrapper">
            <div className="header">
              <div className="walletInfoWrapper">
                <div className="walletTitle">LEVEL</div>
                <div className="walletValue">{gameState.level}</div>
              </div>
              <ScoreCard />
              <div className="walletInfoWrapper">
                <div className="walletTitle">WALLET</div>
                <div className="walletValue">{shortenAddress(userState.wallet)}</div>
              </div>
            </div>
            <CanvasBoard height={GAME_HEIGHT} width={GAME_WIDTH} />
            <RankingBoard />
          </div>
        ) : (
          <div className="menu">
            <div className="menu-title">Snake</div>
            <p>This game requires you to mint a NFT to proceed.</p>
            <p>
              For funds to mint the NFT, get some Sepolia ETH from{' '}
              <a href="https://sepoliafaucet.com/" target="_blank" rel="noopener noreferrer">
                https://sepoliafaucet.com/
              </a>
              .<br />
              Bridge it to Automata Testnet via{' '}
              <a href="https://bridge.ata.network/#/deposit" target="_blank" rel="noopener noreferrer">
                https://bridge.ata.network/#/deposit
              </a>
            </p>
            <p>
              Click <strong>Mint NFT</strong> to mint a Snake and wait for the trasaction to complete to start the game.
            </p>
            <Button
              variant="outlined"
              onClick={async () => {
                try {
                  setIsMinting(true);
                  await mintNFT();
                } catch (e) {
                  console.log(e);
                } finally {
                  setIsMinting(false);
                }
              }}
              disabled={isMinting}
            >
              {isMinting && (
                <>
                  <CircularProgress size={14} />
                  <>&nbsp;</>
                </>
              )}{' '}
              Mint NFT
            </Button>
          </div>
        )
      ) : (
        <div className="menu">
          <div className="menu-title">Snake</div>
          <div>
            <p>Welcome to the traditional snake game.</p>
            <p>
              Click <strong>Start Game</strong> and connect with your Metamask wallet.
            </p>
          </div>
          <Button variant="outlined" onClick={() => onConnectWallet()}>
            Start Game
          </Button>
        </div>
      )}
      {/* <CanvasBoard height={GAME_HEIGHT} width={GAME_WIDTH} /> */}
    </div>
  );
}

export default App;
