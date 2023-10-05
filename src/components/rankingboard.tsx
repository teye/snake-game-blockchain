import { ethers } from 'ethers';
import React from 'react';
import useSWR from 'swr';
import { automataTestnet, LEADERBOARD_CONTRACT, shortenAddress } from '../utils';
import Leaderboard_ABI from '../abis/Leaderboard_ABI.json';

interface Player {
  address: string;
  score: number;
}

/**
 * ranking board contract tracks top 10
 * but in case 1rpc rate limit, we fetch only 3
 */
const MAX_TOP_PLAYER_COUNT = 10;

const fetchRanking = async (key: string) => {
  console.log('fetching ranking');
  let data: Player[] = [];

  const provider = new ethers.providers.JsonRpcProvider(automataTestnet.rpc);
  const rankingContract = new ethers.Contract(LEADERBOARD_CONTRACT, Leaderboard_ABI, provider);

  try {
    for (let i = 0; i < MAX_TOP_PLAYER_COUNT; i++) {
      const player = await rankingContract.leaderboard(i);
      if (player.player === '0x0000000000000000000000000000000000000000') {
        // leader board is empty
        break;
      }
      data.push({
        address: player.player,
        score: player.score.toNumber(),
      } as Player);
    }
  } catch (err) {
    console.log('error fetching ranking: ', err);
  }

  return data;
};

function RankingBoard() {
  const { data, error, isLoading } = useSWR('fetch_ranking', fetchRanking, { refreshInterval: 30000 });

  return (
    <div className="rankingBoardWrapper">
      <div>TOP {MAX_TOP_PLAYER_COUNT} PLAYERS</div>
      {!data || isLoading ? (
        <p>Loading...</p>
      ) : data ? (
        <div className="rankingContentWrapper">
          {data.length === 0 && <div>No highscores.</div>}
          {data.map((player, index) => {
            return (
              <div key={index}>
                {index + 1}. {shortenAddress(player.address)}: {player.score}
              </div>
            );
          })}
        </div>
      ) : null}
    </div>
  );
}

export default RankingBoard;
