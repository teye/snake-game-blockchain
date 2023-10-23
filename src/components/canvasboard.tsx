import 'dotenv/config';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useDispatch } from 'react-redux';
import '../App.css';
import { DOWN, LEFT, RIGHT, UP } from '../store/actions';
import { useAppSelector } from '../store/hooks';
import { ObjectBody } from '../types';
import {
  clearBoard,
  drawObject,
  drawSnake,
  GAME_CHAR_PIXEL_HEIGHT,
  GAME_CHAR_PIXEL_WIDTH,
  generateRandomPosition,
  hasSnakeCollided,
  RARITY,
} from '../utils';
import { SUBMIT_HIGH_SCORE } from '../store/blockchainSlice';
import {
  INCREASE_SNAKE,
  INCREMENT_SCORE,
  STOP_GAME,
  RESET_GAME,
  RESET_GAME_STATE,
  MOVE_SNAKE_EVENT,
  MOVE_RIGHT_EVENT,
  MOVE_LEFT_EVENT,
  MOVE_UP_EVENT,
  MOVE_DOWN_EVENT,
} from '../store/gameSlice';
import GameOverModal from './modal/gameOverModal';
import Button from '@mui/material/Button';
import NFTDetailsModal from './modal/nftDetailsModal';

interface CanvasBoardProps {
  height: number;
  width: number;
}

function CanvasBoard({ height, width }: CanvasBoardProps) {
  const dispatch = useDispatch();
  const score = useAppSelector((state: any) => state.game.score);
  const playerSnake = useAppSelector((state: any) => state.game.snake);
  const level = useAppSelector((state: any) => state.game.level);
  const userState = useAppSelector((state: any) => state.user);
  const nftState = useAppSelector((state: any) => state.nft);
  const disallowedDirection = useAppSelector((state: any) => state.game.disallowedDirection);

  const snakeColor = '#ffffff';
  const snakeGlowColor = useMemo(() => {
    return nftState.rarity === RARITY.common
      ? '#00e676'
      : nftState.rarity === RARITY.rare
      ? '#ffff00'
      : nftState.rarity === RARITY.uncommon
      ? '#2979ff'
      : '#000000';
  }, [nftState]);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [context, setContext] = useState<CanvasRenderingContext2D | null>(null);
  const [foodPosition, setFoodPosition] = useState<ObjectBody>(
    generateRandomPosition(width - GAME_CHAR_PIXEL_WIDTH, height - GAME_CHAR_PIXEL_HEIGHT),
  );
  const [isConsumed, setIsConsumed] = useState<boolean>(false);
  const [gameEnded, setGameEnded] = useState<boolean>(false);
  const [openNFTModal, setOpenNFTModal] = useState<boolean>(false);

  // ds = direction not allowed
  const moveSnake = useCallback(
    (dx = 0, dy = 0, ds: string, dlevel: number) => {
      if (dx > 0 && dy === 0 && ds !== RIGHT) {
        dispatch(
          MOVE_SNAKE_EVENT({
            x: dx,
            y: dy,
            direction: MOVE_RIGHT_EVENT,
            level: dlevel,
          }),
        );
      }

      if (dx < 0 && dy === 0 && ds !== LEFT) {
        dispatch(
          MOVE_SNAKE_EVENT({
            x: dx,
            y: dy,
            direction: MOVE_LEFT_EVENT,
            level: dlevel,
          }),
        );
      }

      if (dx === 0 && dy < 0 && ds !== UP) {
        dispatch(
          MOVE_SNAKE_EVENT({
            x: dx,
            y: dy,
            direction: MOVE_UP_EVENT,
            level: dlevel,
          }),
        );
      }

      if (dx === 0 && dy > 0 && ds !== DOWN) {
        dispatch(
          MOVE_SNAKE_EVENT({
            x: dx,
            y: dy,
            direction: MOVE_DOWN_EVENT,
            level: dlevel,
          }),
        );
      }
    },
    [dispatch],
  );

  const handleKeyEvents = useCallback(
    (event: KeyboardEvent) => {
      switch (event.key) {
        case 'w':
          !gameEnded && moveSnake(0, -20, disallowedDirection, level);
          break;
        case 's':
          !gameEnded && moveSnake(0, 20, disallowedDirection, level);
          break;
        case 'a':
          if (!disallowedDirection) {
            // prevent users from moving the opposite direction (left)
            // at the start of the game
            event.preventDefault();
            break;
          }
          !gameEnded && moveSnake(-20, 0, disallowedDirection, level);
          break;
        case 'd':
          !gameEnded && moveSnake(20, 0, disallowedDirection, level);
          break;
      }
    },
    [disallowedDirection, level, gameEnded, moveSnake],
  );

  const isOutOfBoundary = (snake: any) => {
    return snake[0].x >= width || snake[0].x <= 0 || snake[0].y <= 0 || snake[0].y >= height;
  };

  useEffect(() => {
    // snake eat the food
    const newFoodPosition = generateRandomPosition(width - GAME_CHAR_PIXEL_WIDTH, height - GAME_CHAR_PIXEL_HEIGHT);

    if (isConsumed && foodPosition !== newFoodPosition) {
      setFoodPosition(newFoodPosition);
      setIsConsumed(false);
      dispatch(INCREASE_SNAKE());
      dispatch(INCREMENT_SCORE());
    }
  }, [isConsumed, foodPosition, width, height]);

  useEffect(() => {
    if (userState.nftBalance !== 1) {
      // only load snake if user has connect wallet
      return;
    }

    // draw on canvas each time
    setContext(canvasRef.current && canvasRef.current.getContext('2d'));
    clearBoard(context);

    // render snake
    playerSnake && drawSnake(context, playerSnake, snakeColor, snakeGlowColor);

    // render food
    drawObject(context, [foodPosition], '#ffffff');
  }, [context, playerSnake, foodPosition, userState.nftBalance]);

  useEffect(() => {
    const xDiff = Math.abs(playerSnake[0].x - foodPosition.x);
    const yDiff = Math.abs(playerSnake[1].y - foodPosition.y);

    // difference of position might be off a little
    // when food is consumed
    if (xDiff <= 18 && yDiff <= 18 && !isConsumed) {
      // require isConsumed variable to prevent double counting
      setIsConsumed(true);
    }
  }, [playerSnake, foodPosition, isConsumed]);

  useEffect(() => {
    // check boundaries and collision
    if (hasSnakeCollided(playerSnake, playerSnake[0]) || isOutOfBoundary(playerSnake)) {
      console.log('game ends');
      setGameEnded(true);
      dispatch(STOP_GAME());
      window.removeEventListener('keypress', handleKeyEvents);
    } else {
      setGameEnded(false);
    }
  }, [playerSnake, dispatch, handleKeyEvents]);

  const handleResetBoard = useCallback(
    (event: KeyboardEvent) => {
      switch (event.key) {
        case 'r':
          // resetBoard;
          setGameEnded(false);
          dispatch(RESET_GAME());
          dispatch(RESET_GAME_STATE());
          clearBoard(context);

          // render snake
          playerSnake && drawSnake(context, playerSnake, snakeColor, snakeGlowColor);

          // render food
          const newFoodPosition = generateRandomPosition(
            width - GAME_CHAR_PIXEL_WIDTH,
            height - GAME_CHAR_PIXEL_HEIGHT,
          );
          setFoodPosition(newFoodPosition);
      }
    },
    [context, dispatch, height, width, playerSnake],
  );

  useEffect(() => {
    if (!userState || (userState && !userState.isConnected && userState.nftBalance <= 0)) {
      return;
    }

    // key input
    window.addEventListener('keypress', handleKeyEvents);
    window.addEventListener('keypress', handleResetBoard);

    return () => {
      window.removeEventListener('keypress', handleKeyEvents);
      window.removeEventListener('keypress', handleResetBoard);
    };
  }, [disallowedDirection, handleKeyEvents, userState.isConnected]);

  useEffect(() => {
    if (gameEnded) {
      dispatch(
        SUBMIT_HIGH_SCORE({
          wallet: `${userState.wallet}`,
          score: `${score}`,
        }),
      );
    }
  }, [gameEnded]);

  return (
    <div className="mainCanvasWrapper">
      <canvas
        ref={canvasRef}
        className={gameEnded ? 'canvasWrapperGameEnd' : 'canvasWrapper'}
        height={height}
        width={width}
      />
      <div className="instructionWrapper">
        <div>Controls: W,S,A,D to move - R to reset</div>
        <Button
          variant="outlined"
          onClick={() => setOpenNFTModal(true)}
          sx={{
            color: '#fafafa',
            fontSize: '1rem',
            fontWeight: 700,
            borderRadius: '10px',
          }}
        >
          View NFT
        </Button>
      </div>
      <GameOverModal open={gameEnded} />
      <NFTDetailsModal open={openNFTModal} onClose={() => setOpenNFTModal(false)} />
    </div>
  );
}

export default CanvasBoard;
