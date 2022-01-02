const SHA256 = require('crypto-js/sha256')

class Block {
  constructor(index, timestamp, data, previousHash = '') {
    this.index = index;
    this.timestamp = timestamp;
    this.data = data;
    this.previousHash = previousHash;
    this.hash = this.calculateHash();
  }

  calculateHash() {
    return SHA256(this.index + this.previousHash + this.timestamp + JSON.stringify(this.data)).toString();
  }
}

class Blockchain {
  constructor() {
    this.chain = [this.createGenesisBlock()];
  }

  createGenesisBlock() {
    return new Block (0, '01/01/21', 'Genesis block', '0')
  }

  getLatestBlock() {
    return this.chain[this.chain.length -1]
  }

  addBlock(newBlock) {
    newBlock.previousHash = this.getLatestBlock().hash;
    newBlock.hash = newBlock.calculateHash(); // always update hash after making a change to a block
    this.chain.push(newBlock);
  }

  isChainValid() {
    for(let i = 1; i < this.chain.length; i++) {
      const currentBlock = this.chain[i];
      const prevBlock = this.chain[i-1];

      if (currentBlock.hash !== currentBlock.calculateHash()) {
        return false;
      }

      if (currentBlock.previousHash !== prevBlock.hash) {
        return false;
      }
    }
    return true;
  }
}

let kazCoin = new Blockchain();
kazCoin.addBlock(new Block(1, '27/11/21', {amount: 4}))
kazCoin.addBlock(new Block(2, '28/11/21', {amount: 10}))

// if we tamper with block, new hash doesn't match
kazCoin.chain[1].data = {amount: 100}; 
// even if we recalc hash, the next block will have wrong hash
kazCoin.chain[1].hash = kazCoin.chain[1].calculateHash();

console.log('Is blockchain valid?', kazCoin.isChainValid()) // false
// console.log(kazCoin)