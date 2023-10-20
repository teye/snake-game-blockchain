import React from 'react';
import { Dialog } from '@mui/material';
import { useAppSelector } from '../../store/hooks';

interface GameOverModalProps {
  open: boolean;
}

function GameOverModal(props: GameOverModalProps) {
  const { open } = props;
  const score = useAppSelector((state: any) => state.game.score);

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
    >
      <div className="gameModalWrapper">
        <div className="gameOverTitle">Game Over</div>
        <div className="gameOverScoreWrapper">
          <div className="gameOverScoreTitle">FINAL SCORE</div>
          <div className="gameOverScore">{score}</div>
        </div>
        <div>
          Score automatically submitted.
          <br />
          Press 'r' to play again
        </div>
      </div>
    </Dialog>
  );
}

export default GameOverModal;
