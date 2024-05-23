import { Contract, JsonRpcProvider, ethers } from "ethers";
import { BigNumber } from "bignumber.js";

const erc20abi = [
  "function totalSupply() view returns (uint256)",
  "function balanceOf(address _owner) view returns (uint256)",
];
async function main() {
    const provider = new JsonRpcProvider("https://eth.meowrpc.com");
    const contractAddress ="0xd1e64bcc904cfdc19d0faba155a9edc69b4bcdae"
    const contract = new Contract(contractAddress, erc20abi, provider);

    const totalSupply = await contract.totalSupply();
    console.log("totalSupply",totalSupply)
    let excludedAddresses = [
      "0xfe0fA971eE2e918D602F874aF8AF9C93E6499Fc9",
      "0xd6946698AcDBb92D555Ec8CBB3Af56418f973cae",
      "0xf22ce6191E8AF165A85689044F6d48857d496f81",
      "0x1cA441f054CCD878A3f9Dba4c35092fD1e07D17f",
      "0x58a41Bd5F749c185a2400628B9CAe4f2fcB1aFff",
      "0xE0286Cf1ebfAd558eBAEf9CF8ec5899c340040fE",
      "0xF965671DeC4C8f902083e8E0845cf86aac44FD80"
    ];


    const totalSupplyConverted = new BigNumber(totalSupply);
    let circulatingSupply = totalSupplyConverted;
    for (const address of excludedAddresses) {
      const balance = await contract.balanceOf(address);
      console.log(
        "balance: " ,balance
      )
      circulatingSupply = circulatingSupply.minus(balance);
    }
    console.log(circulatingSupply/1e9)   
}


main()