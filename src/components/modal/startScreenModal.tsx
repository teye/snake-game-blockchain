import React, { useEffect } from 'react';
import { Button, CircularProgress, Dialog } from '@mui/material';
import { useAppSelector } from '../../store/hooks';
import { metaMask } from '../../utils/metamask';

interface StartScreenModalProps {
  open: boolean;
  isMinting: boolean;
  setIsMinting: React.Dispatch<React.SetStateAction<boolean>>;
  onConnectWallet: () => void;
  mintNFT: () => Promise<void>;
}

function StartScreenModal(props: StartScreenModalProps) {
  const { open, isMinting, onConnectWallet, mintNFT, setIsMinting } = props;
  const userState = useAppSelector((state) => state.user);

  if (userState && userState.isConnected && userState.nftBalance > 0) {
    // hide start screen if user has nft
    return <></>;
  }

  return (
    <Dialog
      open={open}
      hideBackdrop={true}
      PaperProps={{
        style: {
          backgroundColor: 'transparent',
          borderRadius: '14px',
        },
      }}
      className="startScreenModal"
    >
      <div className="modalWrapper">
        <div className="menu-title">Snake</div>
        <div className="modalContentWrapper">
          <p>Welcome to the traditional snake game.</p>
          {!metaMask ? (
            <>
              <div>This game requires Metamask to play.</div>
              <div>Please install Metamask to continue.</div>
              <Button
                variant="contained"
                color="customBtnColor"
                href="https://metamask.io/download"
                target="_blank"
                rel="noopener"
                sx={{
                  color: '#fafafa',
                  fontSize: '1rem',
                  fontWeight: 700,
                  borderRadius: '10px',
                }}
              >
                Install Metamask
              </Button>
            </>
          ) : userState.isConnected ? (
            userState.nftBalance > 0 ? null : (
              <>
                <p>This game requires you to mint a NFT to proceed.</p>
                <p>
                  1. For funds to mint the NFT, get some Sepolia ETH from{' '}
                  <a href="https://sepoliafaucet.com/" target="_blank" rel="noopener noreferrer">
                    https://sepoliafaucet.com/
                  </a>
                  .<br />
                  2. Bridge it to Automata Testnet via{' '}
                  <a href="https://bridge.ata.network/#/deposit" target="_blank" rel="noopener noreferrer">
                    https://bridge.ata.network/#/deposit
                  </a>
                </p>
                <p>
                  Click <strong>Mint NFT</strong> to mint a Snake and wait for the trasaction to complete to start the
                  game.
                </p>
                <Button
                  variant="contained"
                  color="customBtnColor"
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
                  sx={{
                    color: '#fafafa',
                    fontSize: '1rem',
                    fontWeight: 700,
                    borderRadius: '10px',
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
              </>
            )
          ) : (
            /* user has metamask, connect wallet to proceed */
            <>
              <div>
                Click <strong>Start Game</strong> and connect with your Metamask wallet.
              </div>
              <Button
                variant="contained"
                color="customBtnColor"
                onClick={onConnectWallet}
                disableElevation={true}
                sx={{
                  color: '#fafafa',
                  fontSize: '1rem',
                  fontWeight: 700,
                  borderRadius: '10px',
                }}
              >
                Start Game
              </Button>
            </>
          )}
        </div>
      </div>
    </Dialog>
  );
}

export default StartScreenModal;
