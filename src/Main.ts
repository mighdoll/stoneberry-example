import { PrefixScan } from "stoneberry/scan";
import { bufferI32 } from "thimbleberry";

main();

async function main(): Promise<void> {
  const adapter = await navigator.gpu.requestAdapter();
  const device = await adapter!.requestDevice();
  const srcData = [1, 2, 3, 4, 5, 6];
  const src = bufferI32(device, srcData);

  const prefixScan = new PrefixScan({ device, src });
  const inclusiveResult = await prefixScan.scan();

  prefixScan.exclusive = true;
  prefixScan.initialValue = 19;
  const exclusiveResult = await prefixScan.scan();

  render(srcData, inclusiveResult, exclusiveResult);
}

function render(src: number[], inclusive: number[], exclusive: number[]): void {
  const app = document.querySelector("div#app")!;
  app.innerHTML = `
    <table>
      <tr> <td style="width:5em">source</td> ${nums(src)} </tr>
      <tr> <td>inclusive</td> ${nums(inclusive)} </tr>
      <tr> <td>exclusive</td> ${nums(exclusive)} </tr>
    </table>
  `;
}

function nums(array: number[]): string {
  return array.map((s) => `<td style="width:1.5em">${s}</td>`).join(" ");
}
