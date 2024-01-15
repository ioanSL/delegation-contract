# Delegation Contract

This project aim to provide a solution to delegate on-chain assets ownership to target addresses.

## Doc

[Implementation Proposal](https://www.notion.so/Proposal-Delegated-assets-30a75de0661e41878d815e7d3ef4a53a?pvs=4)

```shell
# Run tests. Use REPORT_GAS=true and set Coinmarketcap api key for more details
npx hardhat test

# Deploy Delegate and aux contracts to Sepolia Network.
npx hardhat run scripts/deploy.ts --network sepolia

# Delegate ERC721
npx ts-node scripts/delegateERC721.ts $DELEGATOR $DELEGATEE $ASSET_ADDRESS $TOKENID $LICENSE $true/false
```
