import { PrefixScan } from "stoneberry/scan";
import { ShaderGroup, bufferI32, withBufferCopy } from "thimbleberry";
import { resultTable } from "./resultTable.ts";

main();

async function main(): Promise<void> {
  const adapter = await navigator.gpu.requestAdapter();
  const device = await adapter!.requestDevice();
  const srcData = [1, 2, 3, 4, 5, 6];
  const src = bufferI32(device, srcData);

  // inclusive scan
  const prefixScan = new PrefixScan({ device, src });
  const inclusiveResult = await prefixScan.scan();

  // exclusive scan
  prefixScan.exclusive = true;
  prefixScan.initialValue = 19;
  const exclusiveResult = await prefixScan.scan();

  // two shader sequence 
  const doubleShaders = await multipleShaders(device, src);

  resultTable([
    { name: "source", data: srcData },
    { name: "inclusive", data: inclusiveResult },
    { name: "exclusive", data: exclusiveResult },
    { name: "excl + incl", data: doubleShaders },
  ]);
}

/** a sequence of two connected shaders 
 * 
 * (in this case both shaders are scans, but in real life scan would be connected to a different shader)
*/
async function multipleShaders(
  device: GPUDevice,
  src: GPUBuffer
): Promise<number[]> {
  const prefixScan = new PrefixScan({ device, src, exclusive: true, initialValue: 19 });
  const otherShader = new PrefixScan({ device, src: () => prefixScan.result }); // note dynamic link to previous

  // launch shaders
  const group = new ShaderGroup(device, prefixScan, otherShader);
  group.dispatch();

  // collect results
  const otherResult = await withBufferCopy(device, otherShader.result, "i32", (d) =>
    d.slice()
  );
  return [...otherResult];
}
