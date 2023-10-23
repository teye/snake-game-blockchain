import { ethers } from 'ethers';
import React, { useEffect, useState } from 'react';
import NFTABI from './abis/NFTABI.json';
import NFTNoVRFABI from './abis/NFTNoVRFABI.json';
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
import { gameNetwork, GAME_HEIGHT, GAME_WIDTH, NFT_CONTRACT, shortenAddress } from './utils';
import StartScreenModal from './components/modal/startScreenModal';
import { metaMask } from './utils/metamask';

let signerProvider: ethers.providers.Web3Provider;

function App() {
  const dispatch = useAppDispatch();
  const userState = useAppSelector((state) => state.user);
  const gameState = useAppSelector((state) => state.game);
  const [isMinting, setIsMinting] = useState(false);
  const [openStartScreen, setOpenStartScreen] = useState(true);

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
    let rpcProvider: ethers.providers.JsonRpcProvider = new ethers.providers.JsonRpcProvider(gameNetwork.rpc);
    const nftContract = new ethers.Contract(NFT_CONTRACT, NFTNoVRFABI, rpcProvider);
    const nftBalance = await nftContract.balanceOf(wallet);

    if (nftBalance.toNumber() > 0) {
      try {
        const tokenId = await nftContract.getTokenID(wallet);

        if (!tokenId) {
          return;
        }

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
      } catch (e) {
        console.error(e);
      }
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
              method: 'wallet_switchEthereumChain',
              params: [
                {
                  chainId: gameNetwork.chainIdHex,
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
      dispatch(UPDATE_NFT_BALANCE(0));
      dispatch(UPDATE_TOKEN_ID(''));
      dispatch(UPDATE_TOKEN_URI(''));
      dispatch(UPDATE_RARITY(''));
      await fetchNFT(address);
      dispatch(UPDATE_WALLET(address));
      updateWalletBalance(accounts);
    }
    setIsMinting(false);
  };

  useEffect(() => {
    if (!metaMask) {
      return;
    }
    window.ethereum.on('accountsChanged', handleAccountsChanged);
  }, []);

  useEffect(() => {
    if (userState && userState.isConnected && userState.nftBalance > 0) {
      setOpenStartScreen(false);
    } else if (userState.wallet) {
      // change account
      // open the startscreen modal
      setOpenStartScreen(true);
    }
  }, [userState]);

  return (
    <div className="App">
      <div className="gameScreenWrapper">
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
        </div>
        <RankingBoard />
      </div>
      <StartScreenModal
        open={openStartScreen}
        isMinting={isMinting}
        setIsMinting={setIsMinting}
        onConnectWallet={onConnectWallet}
        mintNFT={mintNFT}
      />
    </div>
  );
}

export default App;
