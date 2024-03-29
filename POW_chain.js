const SHA256 = require('crypto-js/sha256')

class Block {
  constructor(index, timestamp, data, previousHash = '') {
    this.index = index;
    this.timestamp = timestamp;
    this.data = data;
    this.previousHash = previousHash;
    this.hash = this.calculateHash();
    this.nonce = 0; // need to change this number to change hash in while loop  (can't change any of the above)
  }

  calculateHash() {
    return SHA256(this.index + this.previousHash + this.timestamp + JSON.stringify(this.data) + this.nonce).toString();
  }

  mineBlock(difficulty) {
    // while start of string is not equal to 'difficulty' number of zeros
    while(this.hash.substring(0, difficulty) !== Array(difficulty + 1).join('0')) {
      this.nonce ++; 
      this.hash = this.calculateHash();
    }
    console.log('Block mined: ' + this.hash)
  }
}

class Blockchain {
  constructor() {
    this.chain = [this.createGenesisBlock()];
    this.difficulty = 4; // hash needs to start with 4 0's
  }

  createGenesisBlock() {
    return new Block (0, '01/01/21', 'Genesis block', '0')
  }

  getLatestBlock() {
    return this.chain[this.chain.length -1]
  }

  addBlock(newBlock) {
    newBlock.previousHash = this.getLatestBlock().hash;
    // newBlock.hash = newBlock.calculateHash();
    newBlock.mineBlock(this.difficulty);
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

console.log('Mining block 1 ...');
kazCoin.addBlock(new Block(1, '27/11/21', {amount: 4}))
console.log('Mining block 2...');
kazCoin.addBlock(new Block(2, '28/11/21', {amount: 10}))

