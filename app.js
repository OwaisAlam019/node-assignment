const stock = require("./stock.json");
const transactions = require("./transactions.json");

var _ = require("lodash");
let userInputSku = "";

const readline = require("readline").createInterface({
  input: process.stdin,
  output: process.stdout,
});

readline.question(`Enter SKU :`, async (sku) => {
  currentStockLevel = await getCurrentStock(sku).catch((err) =>
    console.log(err.message)
  );
  console.log(` \n\n Current Stock for SKU ${sku} is ${currentStockLevel}`);
  readline.close();
});

/*
function will take sku as inpu param and return promise of current available stock
*/
async function getCurrentStock(sku) {
  currentStock = 0;
  userInputSku = sku;
  stockItem = _.find(stock, { sku: sku });
  if (!stockItem) {
    throw new Error(`SKU ${sku} not found`);
  } else{
    currentStock = stockItem.stock;

    skuTransactions = _.filter(transactions, { sku: sku });

    // console.log(skuTransactions,"skuTransactions");
  
    if(!skuTransactions.length){
      throw new Error(` SKU ${sku} not found in transactions`);
    }
    
    skuTransactions.forEach((element) => {
      if (element.type == "refund") {
        currentStock += element.qty;
      } else currentStock -= element.qty;
    });
  }

  return currentStock;
}
