import 'dotenv/config';
import { ethers } from 'ethers';
import { call, takeEvery } from 'redux-saga/effects';
import { gameNetworkProvider, LEADERBOARD_CONTRACT } from '../../utils';
import { SUBMIT_HIGH_SCORE } from '../blockchainSlice';
import Leaderboard_ABI from '../../abis/Leaderboard_ABI.json';

async function invokeContract(wallet: string, score: number) {
  const deployerKey = process.env.REACT_APP_LEADERBOARD_PK || '';
  const signer = new ethers.Wallet(deployerKey, gameNetworkProvider);
  const scoreboardContract = new ethers.Contract(LEADERBOARD_CONTRACT, Leaderboard_ABI, signer);

  try {
    let isEligible = false;
    // always fetch the 10th player in the ranking board
    const minTopScore = await scoreboardContract.leaderboard(9);

    if (minTopScore.player === '0x0000000000000000000000000000000000000000') {
      isEligible = true;
    } else if (minTopScore.score.toNumber() < score) {
      isEligible = true;
    }

    if (isEligible) {
      const tx = await scoreboardContract.addScore(`${wallet}`, `${score}`);
      const txReceipt = await tx.wait();

      if (txReceipt && txReceipt.status === 1) {
        console.log('score updated: ', tx);
      }
    }
  } catch (e) {
    console.log('error submitting highscore: ', e);
  }
}

/**
 * listen to submit high score from dispatch and call contract
 */
function* submitHighScore(action: any) {
  console.log('submit high score');
  // submit highscore using deployer wallet
  const deployerKey = process.env.REACT_APP_LEADERBOARD_PK || '';
  const { wallet, score } = action.payload;

  if (!deployerKey || score <= 0) {
    console.error('Deployer wallet not configure');
    return;
  }

  yield call(invokeContract, wallet, score);
}

function* blockchainSaga() {
  yield takeEvery(SUBMIT_HIGH_SCORE, submitHighScore);
}

export default blockchainSaga;
