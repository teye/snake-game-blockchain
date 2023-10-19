import React from 'react';
import { useAppSelector } from '../store/hooks';

function ScoreCard() {
  // const score = useSelector((state: any) => (state.gameReducer as GameState).score);
  const score = useAppSelector((state: any) => state.game.score);
  return (
    <div className="scoreWrapper">
      <div className="scoreTitle">SCORE</div>
      <div className="scoreValue">{score}</div>
    </div>
  );
}

export default ScoreCard;
