import headers from "./headers.js";

const comissionUrl =
  "https://www.trinks.com/BackOffice/Comissao/ResultadoRelatorioComissoes";

const feeCardUrl =
  "https://www.trinks.com/BackOffice/Relatorios/ResultadoRelatorioFinanceiroPorFormaPagamento";

const expensesTableUrl =
  "https://www.trinks.com/Backoffice/Despesas/ExibirLinhasAgrupadasPorData";

const expensesDetailUrl =
  "https://www.trinks.com/Backoffice/Despesas/ExibirLinhasDeLancamentos";

const lojaIds = {
  14: {
    idRelacaoProfissional: "46810",
    idEstabelecimento: "18769",
  },
  batista: {
    idRelacaoProfissional: "103890",
    idEstabelecimento: "35295",
  },
  duque: {
    idRelacaoProfissional: "440885",
    idEstabelecimento: "120037",
  },
  umarizal: {
    idRelacaoProfissional: "49102",
    idEstabelecimento: "19357",
  },
};

function stringToNumber(str) {
  return parseFloat(
    str.replace(/\s/g, "").replace(/\./g, "").replace(",", "."),
  );
}

function getHeadersForStore(store) {
  const idEstabelecimentoPattern = new RegExp(
    "(?<=TrinksAuth.+idEstabelecimentoPadrao)(.+?)=(.+?)(?=;)",
  );
  const cookie = headers.Cookie.replace(
    idEstabelecimentoPattern,
    `$1=${lojaIds[store].idEstabelecimento}`,
  );

  return {
    ...headers,
    "id-estabelecimento-autenticado": lojaIds[store].idEstabelecimento,
    Cookie: cookie,
  };
}

async function comissionFetch(store) {
  const requestBody = {
    TipoData: 2,
    DataInicio: "01/01/2026",
    DataFim: "31/01/2026",
    TipoItemPago: 0,
    ExibirEstornos: false,
    TipoStatusFiltroPagamento: 1,
    IdRelacaoProfissional: lojaIds[store].idRelacaoProfissional,
    temPagamentoProfissional: true,
  };

  const body = new URLSearchParams(requestBody);

  const storeHeaders = getHeadersForStore(store);

  const response = await fetch(comissionUrl, {
    method: "POST",
    headers: storeHeaders,
    body,
  });

  const responseBody = await response.json();
  const table = responseBody.Html;

  const comissionPattern = /(?<=<td class="alignRight">).+?(?=<)/g;
  const values = table.match(comissionPattern);
  return stringToNumber(values[8]);
}

async function feeCardFetch(store) {
  const requestBody = {
    TemPermissaoParaFiltroCompleto: true,
    TipoData: 2,
    DataInicio: "01/01/2026",
    DataFim: "31/01/2026",
    IdFormaPagamentoOuTipo: 0,
    ExibirEstornos: false,
    ExibirCreditoClienteExportacao: [true, false],
    IdContaFinanceiraSelecionada: 0,
  };

  const body = new URLSearchParams(requestBody);

  const response = await fetch(feeCardUrl, {
    method: "POST",
    headers: getHeadersForStore(store),
    body,
  });

  const responseBody = await response.json();

  const table = responseBody.Html;

  const feePattern = /(?<=<td class="alignRight"><span>).+?(?=<)/g;
  const values = table.match(feePattern);

  return stringToNumber(values[0]);
}

async function expensesDatesFetch(store) {
  const requestBody = {
    "Filtro.IdEstabelecimento": lojaIds[store].idEstabelecimento,
    "Filtro.TipoBuscaPeriodoContaAPagar": 0,
    "Filtro.InicioPeriodo": "01/01/2026",
    "Filtro.FinalPeriodo": "31/01/2026",
    "Filtro.IdLancamentoGrupo": 0,
    "Filtro.IdLancamentoCategoria": 0,
    "Filtro.StatusPagamento": 0,
    "Filtro.IdPessoaProfissional": 0,
    "Filtro.ApenasAtivos": true,
    "Filtro.IdPessoaFornecedor": 0,
    "Filtro.IdFormaPagamento": 0,
    "Filtro.Mes": 1,
    "Filtro.Ano": 2026,
    "Filtro.IndexLinhaTabela": 0,
  };

  const body = new URLSearchParams(requestBody);

  const response = await fetch(expensesTableUrl, {
    method: "POST",
    headers: getHeadersForStore(store),
    body,
  });

  const responseBody = await response.json();

  const table = responseBody.Html;
  const datePattern =
    /(?<=<\/a>[\s\S]+<\/td>[\s\S]+<td>)(\d{2}\/\d{2}\/\d{4})(?=<)/g;

  const dates = table.match(datePattern);
  return dates;
}

async function expensesDetailsFetch(store, date, index) {
  const requestBody = {
    "Filtro.IdEstabelecimento": lojaIds[store].idEstabelecimento,
    "Filtro.TipoBuscaPeriodoContaAPagar": 0,
    "Filtro.InicioPeriodo": "01/01/2026",
    "Filtro.FinalPeriodo": "31/01/2026",
    "Filtro.IdLancamentoGrupo": 0,
    "Filtro.IdLancamentoCategoria": 0,
    "Filtro.StatusPagamento": 0,
    "Filtro.IdPessoaProfissional": 0,
    "Filtro.ApenasAtivos": true,
    "Filtro.IdPessoaFornecedor": 0,
    "Filtro.IdFormaPagamento": 0,
    "Filtro.DataAgrupamento": date,
    "Filtro.IndexLinhaTabela": index,
  };

  const body = new URLSearchParams(requestBody);

  const response = await fetch(expensesDetailUrl, {
    method: "POST",
    headers: getHeadersForStore(store),
    body,
  });

  const responseBody = await response.json();

  const table = responseBody.Html;

  console.log(table);
}

async function expensesFetch(store) {
  const dates = await expensesDatesFetch(store);

  for (const [index, date] of dates.entries()) {
    await expensesDetailsFetch(store, date, index);
  }
}

const request = {
  comissionFetch,
  feeCardFetch,
  expensesFetch,
};

export default request;
