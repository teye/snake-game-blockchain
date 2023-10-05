import 'dotenv/config';
import { ethers } from 'ethers';
import { call, takeEvery } from 'redux-saga/effects';
import { automataTestnet, LEADERBOARD_CONTRACT } from '../../utils';
import { SUBMIT_HIGH_SCORE } from '../blockchainSlice';
import Leaderboard_ABI from '../../abis/Leaderboard_ABI.json';

async function invokeContract(wallet: string, score: number) {
  const deployerKey = process.env.REACT_APP_LEADERBOARD_PK || '';
  const provider = new ethers.providers.JsonRpcProvider(automataTestnet.rpc);
  const signer = new ethers.Wallet(deployerKey, provider);
  const scoreboardContract = new ethers.Contract(LEADERBOARD_CONTRACT, Leaderboard_ABI, signer);
  const tx = await scoreboardContract.addScore(`${wallet}`, `${score}`);
  const txReceipt = await tx.wait();

  console.log('updating score: ', tx);
  if (txReceipt && txReceipt.status === 1) {
    console.log('score updated: ', txReceipt);
  }
}

/**
 * listen to submit high score from dispatch and call contract
 */
function* submitHighScore(action: any) {
  console.log('submit high score');
  console.log('action: ', action);
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
