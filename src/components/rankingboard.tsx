import { ethers } from 'ethers';
import React from 'react';
import useSWR from 'swr';
import { gameNetworkProvider, LEADERBOARD_CONTRACT, shortenAddress } from '../utils';
import Leaderboard_ABI from '../abis/Leaderboard_ABI.json';
import Blockies from 'react-blockies';
import { MulticallWrapper } from 'ethers-multicall-provider';

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

  try {
    const multicall = MulticallWrapper.wrap(gameNetworkProvider);
    const rankingContract = new ethers.Contract(LEADERBOARD_CONTRACT, Leaderboard_ABI, multicall);
    const calls = [];

    for (let i = 0; i < MAX_TOP_PLAYER_COUNT; i++) {
      calls.push(rankingContract.leaderboard(i));
    }

    const scoresList = await Promise.all(calls);

    for (const player of scoresList) {
      if (player && player.player !== '0x0000000000000000000000000000000000000000') {
        data.push({
          address: player.player,
          score: player.score.toNumber(),
        } as Player);
      }
    }
  } catch (err) {
    console.log('error fetching ranking: ', err);
  }

  return data;
};

function RankingBoard() {
  const { data, error, isLoading } = useSWR('fetch_ranking', fetchRanking, {
    refreshInterval: 60000,
    revalidateOnFocus: false,
  });

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
              <div className="rankCard" key={index}>
                <div className="rankInfo">
                  {index + 1}
                  <Blockies
                    seed={player.address}
                    size={10}
                    scale={3}
                    color="#8ed1fb"
                    bgColor="#5272f2"
                    spotColor="#aedefc"
                    className="avatar"
                  />
                  {shortenAddress(player.address)}
                </div>
                <div>{player.score}</div>
              </div>
            );
          })}
        </div>
      ) : null}
    </div>
  );
}

export default RankingBoard;
