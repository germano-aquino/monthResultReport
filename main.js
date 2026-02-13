import he from "he";
import fs from "fs";
import { json2csv } from "json-2-csv";
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

let expensesByType = {
  14: {},
  batista: {},
  duque: {},
  umarizal: {},
};

await main();

async function main() {
  for (const store of report) {
    console.log("Gerando relatório da loja %s.", store.loja);

    store.comissaoMEI = await getComission(store.loja);
    store.taxaCartao = await getFeeCard(store.loja);
    store.despesasConsolidadas = await getExpenses(store.loja);

    console.log("Relatório da loja %s finalizado.\n", store.loja);
    console.log(store);
  }

  writeCsvFile();
}

async function getComission(store) {
  return await request.comissionFetch(store);
}

async function getFeeCard(store) {
  return await request.feeCardFetch(store);
}

async function getExpenses(store) {
  let total = 0;

  const expenses = await request.expensesFetch(store);
  expensesByType[store] = expenses;

  for (const expense of Object.values(expenses)) total += expense;
  return total;
}

function writeCsvFile() {
  const csvFile = json2csv(report, {
    emptyFieldValue: 0,
    delimiter: { field: "\t" },
  });
  fs.writeFileSync("relatorio.csv", csvFile, "utf-8");
  for (const [store, expenses] of Object.entries(expensesByType)) {
    const csvExpenseObj = [];
    for (const [key, value] of Object.entries(expenses))
      csvExpenseObj.push({ despesa: key, valor: value });
    const csvExpenseFile = json2csv(csvExpenseObj, {
      emptyFieldValue: 0,
      delimiter: { field: "\t" },
    });
    fs.writeFileSync(`despesas-${store}.csv`, csvExpenseFile);
  }
}
