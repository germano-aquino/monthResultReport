import readline from "readline";

import request from "./request.js";

async function get() {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  const allowedInputs = ["", "m", "d"];

  console.log("Instruções:");
  console.log("Aperte 'enter' para gerar o relatório do mês passado.");
  console.log(
    "Aperte 'd e enter' para selecionar uma data de ínicio e de fim.\n",
  );
  const option = await question("Insira instrução:\n", rl);

  if (!allowedInputs.includes(option)) {
    rl.close();
    throw new Error("Instrução %s é inválida", option);
  }

  if (option === "") {
    rl.close();
  }

  if (option === "d") {
    console.log("Digite a data inicial com o seguinte formato 13/02/2026");
    const startDateInput = await question("Insira a data de ínicio:", rl);
    const finalDateInput = await question("Insira a data de término:", rl);
    rl.close();
    validateDates(startDateInput, finalDateInput);
    const split = startDateInput.split("/");
    request.setMonthAndYear(split[1], split[2]);
    request.setStartDate(startDateInput);
    request.setFinalDate(finalDateInput);
  }

  console.log(
    "\nCalculando relatório a partir de %s até %s\n",
    request.getStartDate(),
    request.getFinalDate(),
  );
}

function question(statement, rl) {
  return new Promise((resolve) => {
    rl.question(statement, (answer) => {
      resolve(answer);
    });
  });
}

function validateDates(start, final) {
  const datePattern =
    /^(0?[1-9]|[12][0-9]|3[01])[\/\-](0?[1-9]|1[012])[\/\-]\d{4}$/;
  if (!datePattern.test(start)) {
    throw new Error(`Data inicial ${start} não segue o padrão 01/03/2025.`);
  }

  if (!datePattern.test(final)) {
    throw new Error(`Data final ${final} não segue o padrão 01/03/2025.`);
  }

  const startDate = new Date(start);
  const finalDate = new Date(final);

  if (finalDate <= startDate) {
    throw new Error("A data final deve ser após a inicial.");
  }
}

const userInput = {
  get,
};

export default userInput;
