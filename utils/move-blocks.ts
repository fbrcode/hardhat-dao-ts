import { network } from 'hardhat';

export async function moveBlocks(blocks: number) {
  console.log(`Moving ${blocks} blocks...`);
  for (let i = 0; i < blocks; i++) {
    await network.provider.request({
      method: 'evm_mine',
      params: [],
    });
  }
}
