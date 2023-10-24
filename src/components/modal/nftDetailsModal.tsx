import { Dialog } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useAppSelector } from '../../store/hooks';
import { NFT_CONTRACT } from '../../utils';
import COMMON_SNAKE_DATA from '../../metadata/1.json';
import UNCOMMON_SNAKE_DATA from '../../metadata/2.json';
import RARE_SNAKE_DATA from '../../metadata/3.json';
import gardenSnake from '../../assets/garden_snake.png';
import viper from '../../assets/viper.png';
import kingCobra from '../../assets/king_cobra.png';
import { XMarkIcon } from '@heroicons/react/24/solid';
import ClipboardButton from '../clipboard-btn';

interface NFTDetailsModalProps {
  open: boolean;
  onClose: () => void;
}

interface NFTAttributes {
  trait_type: string;
  value: string;
}

interface NFTMetdata {
  name: string;
  description: string;
  image: string;
  external_url: string;
  attributes: NFTAttributes[];
}

function NFTDetailsModal(props: NFTDetailsModalProps) {
  const { open, onClose } = props;
  const nftState = useAppSelector((state: any) => state.nft);
  const [metadata, setMetadata] = useState<NFTMetdata>();
  const [imageSrc, setImageSrc] = useState<any>();

  useEffect(() => {
    if (!nftState.tokenURI) {
      return;
    }

    const tokenURIArray = nftState.tokenURI.split('/');
    const lastPart = tokenURIArray[tokenURIArray.length - 1];
    let json;

    if (lastPart === '3.json') {
      json = RARE_SNAKE_DATA;
      setImageSrc(kingCobra);
    } else if (lastPart === '2.json') {
      json = UNCOMMON_SNAKE_DATA;
      setImageSrc(viper);
    } else {
      json = COMMON_SNAKE_DATA;
      setImageSrc(gardenSnake);
    }
    setMetadata({
      name: json.name,
      description: json.description,
      image: json.image,
      external_url: json.external_url,
      attributes: JSON.parse(JSON.stringify(json.attributes)),
    } as NFTMetdata);
  }, [nftState.tokenURI]);

  return (
    <Dialog
      open={open}
      PaperProps={{
        style: {
          backgroundColor: 'transparent',
          borderRadius: '14px',
        },
      }}
      onClose={onClose}
    >
      <div className="nftDetailsModalWrapper">
        <button className="modalCloseBtn" onClick={() => onClose()}>
          <XMarkIcon />
        </button>
        <div>
          {/* nft image */}
          <img src={imageSrc} alt="nft image" className="nftImageStyle" />
        </div>
        <div className="nftContentWrapper">
          {/* nft details */}
          <div>
            <div className="nftDetailsTitle">NFT</div>
            <div className="nftDetailsValueWithClipboard">
              <div>{NFT_CONTRACT}</div> <ClipboardButton copyText={NFT_CONTRACT} />
            </div>
          </div>
          <div>
            <div className="nftDetailsTitle">TOKEN ID</div>
            <div className="nftDetailsValueWithClipboard">
              <div>#{nftState.tokenID}</div> <ClipboardButton copyText={nftState.tokenID} />
            </div>
          </div>
          <div>
            <div className="nftDetailsTitle">RARITY</div>
            <div className="nftRarity">{nftState.rarity}</div>
          </div>
          <div>
            <div className="nftDetailsTitle">Description</div>
            <div>{metadata && metadata.description}</div>
          </div>
        </div>
      </div>
    </Dialog>
  );
}

export default NFTDetailsModal;
