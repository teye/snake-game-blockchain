import { ObjectBody } from '../types';

export const GAME_HEIGHT = 600;
export const GAME_WIDTH = 600;
export const GAME_CHAR_PIXEL_HEIGHT = 20;
export const GAME_CHAR_PIXEL_WIDTH = 20;
export const NFT_CONTRACT = '0xB3a54BeBd28838c303c44f8fD7E1E5c7560a11F5';
export const LEADERBOARD_CONTRACT = '0x2f65d1142fB7577D8DE00fDA4De4a6A33e6CdD56';

export const clearBoard = (context: CanvasRenderingContext2D | null) => {
  if (context) {
    context.clearRect(0, 0, GAME_WIDTH, GAME_HEIGHT);
  }
};

export const drawObject = (
  context: CanvasRenderingContext2D | null,
  objectBody: ObjectBody[],
  fillColor: string,
  strokeStyle = '#146356',
) => {
  if (context && objectBody.length > 0) {
    objectBody.forEach((object: ObjectBody) => {
      context.fillStyle = fillColor;
      context.strokeStyle = strokeStyle;
      context.beginPath();
      context.arc(object.x, object.y, 10, 0, 2 * Math.PI);
      context.fill();
    });
  }
};

export const drawSnake = (
  context: CanvasRenderingContext2D | null,
  objectBody: ObjectBody[],
  fillColor: string,
  glowColor: string,
) => {
  if (context && objectBody.length > 0) {
    objectBody.forEach((object: ObjectBody) => {
      context.fillStyle = fillColor;
      context.strokeStyle = fillColor;
      context.beginPath();

      context.arc(object.x, object.y, 9, 0, 2 * Math.PI);
      context.shadowBlur = 10;
      context.shadowColor = glowColor;
      context.fill();
      context.stroke();
    });
  }
};

function randomNumber(max: number) {
  let random = Math.floor(Math.random() * max);
  while (
    random <= 0 ||
    random < GAME_CHAR_PIXEL_WIDTH ||
    random >= GAME_HEIGHT ||
    random >= random + GAME_CHAR_PIXEL_HEIGHT
  ) {
    random = Math.floor(Math.random() * max);
    random = random - (random % GAME_CHAR_PIXEL_HEIGHT); // remove the stray digits so that it is even
  }
  return random;
}

export const generateRandomPosition = (width: number, height: number) => {
  return {
    x: randomNumber(width),
    y: randomNumber(height),
  };
};

export const hasSnakeCollided = (snake: ObjectBody[], currentHeadPos: ObjectBody) => {
  // check if snake collided with its own head
  let flag = false;
  snake.forEach((pos: ObjectBody, index: number) => {
    if (pos.x === currentHeadPos.x && pos.y === currentHeadPos.y && index !== 0) {
      flag = true;
    }
  });
  return flag;
};

export interface NetworkChain {
  name: string;
  rpc: string;
  chainId: number;
  chainIdHex: string;
  currency: string;
  explorer: string;
  decimals: number;
}

export const gameNetwork = {
  name: 'Sepolia',
  rpc: 'https://endpoints.omniatech.io/v1/eth/sepolia/public',
  chainId: 11155111,
  chainIdHex: '0xaa36a7',
  currency: 'SepoliaETH',
  explorer: 'https://sepolia.etherscan.io',
  decimals: 18,
} as NetworkChain;

export const automataTestnet = {
  name: 'Automata Testnet',
  rpc: 'https://1rpc.io/ata/testnet',
  chainId: 1398243,
  chainIdHex: '0x1555e3',
  currency: 'ETH',
  explorer: 'https://explorer.ata.network',
  decimals: 18,
} as NetworkChain;

export enum RARITY {
  common = 'common',
  uncommon = 'uncommon',
  rare = 'rare',
}

export const shortenAddress = (input: string, length = 7) => input.slice(0, length) + '...';
