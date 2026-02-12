import request from "./request.js";

const report = [
  {
    loja: "14",
    comissaoMEI: 0,
    taxaCartao: 0,
    despesasConsolidadas: 0,
  },
  {
    loja: "batista",
    comissaoMEI: 0,
    taxaCartao: 0,
    despesasConsolidadas: 0,
  },
  {
    loja: "duque",
    comissaoMEI: 0,
    taxaCartao: 0,
    despesasConsolidadas: 0,
  },
  {
    loja: "umarizal",
    comissaoMEI: 0,
    taxaCartao: 0,
    despesasConsolidadas: 0,
  },
];

await main();

async function main() {
  // for (store of report) {
  //   store.comissaoMEI = await getComission(store.loja)
  //   store.taxaCartao = await getFeeCard(store.loja)
  //   store.despesasConsolidadas = await getFixedExpenses(store.loja)
  // }
  await getFixedExpenses("14");
}

async function getComission(store) {
  return 0;
  return await request.comissionFetch(store);
}

async function getFeeCard(store) {
  return 0;
  return await request.feeCardFetch(store);
}

async function getFixedExpenses(store) {
  await request.expensesFetch(store);
}
