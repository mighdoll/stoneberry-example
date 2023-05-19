export interface ResultRow {
  name: string;
  data: number[];
}

/** display a table of results */
export function resultTable(results: ResultRow[]): void {
  const app = document.querySelector("div#app")!;

  const renderedRows = results.map(renderRow).join("\n");

  app.innerHTML = `
    <table>
      ${renderedRows}
    </table>
  `;
}

function renderRow(resultRow: ResultRow): string {
  const { name, data } = resultRow;
  const dataColumns = numberColumns(data);
  return `<tr> <td style="width:5em">${name}</td> ${dataColumns} </tr>`;
}

function numberColumns(array: number[]): string {
  return array.map((s) => `<td style="width:1.5em">${s}</td>`).join(" ");
}
