import { network } from 'hardhat';

export async function moveTime(secondsAmount: number) {
  console.log(`Moving time ${secondsAmount} second(s)...`);
  await network.provider.send('evm_increaseTime', [secondsAmount]);
  console.log('Time moved!');
}
