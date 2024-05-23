let { Web3 } = require("web3");
let { abi } = require("./abi.json");
let web3 = new Web3(
  "https://eth-mainnet.g.alchemy.com/v2/nTHK4kdrcr5c8L4sOnQb6uk3Tibmuerr"
);
let fs = require("fs");
let contract = new web3.eth.Contract(
  abi,
  "0xD1e64bcc904Cfdc19d0FABA155a9EdC69b4bcdAe"
);
async function init() {
  // let startBlock = 19490621;
  // let endBlock =   19668108;
  
  // let startBlock = 19668109;
  // let endBlock =   19761003;


  // let startBlock = 19761004;
  // let endBlock =   19816206;


  
  // let startBlock = 19816207;
  // let endBlock =   19859344;

  //  let startBlock = 19859345;
  //  let endBlock =   19911193;


  //  let startBlock = 19911194;
  //  let endBlock =   19930491;

  let termination = true;
  while (termination) {
    let toBlock = startBlock + 1024;
    if (toBlock > endBlock) {
      toBlock = endBlock;
      termination = false;
    }
    console.log("startBlock",startBlock)
    let res = await contract.getPastEvents("Transfer", {
      fromBlock: startBlock,
      toBlock: toBlock,
      filter:{from :"0xd6946698AcDBb92D555Ec8CBB3Af56418f973cae"}
    });
    if (res.length > 0) {
      for (let i of res) {
        let { from, to, value } = i.returnValues;
       
          fs.appendFile("./total_txns.csv",`${to}, ${value}\n` ,(err)=>{
            if(err) throw err;
            console.log({ from, to, value });
          })

        
      }
    }
    startBlock = toBlock + 1;
  }

}

init();




