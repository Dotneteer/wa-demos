const WIDTH = 1200;
const HEIGHT = 800;
let instance: WebAssembly.Instance | null = null;

(async () => {
  try {
    const response = await fetch("/build/memory.wasm");
    const wasmBinary = await response.arrayBuffer();
    instance = (
      await WebAssembly.instantiate(wasmBinary, {
        imports: {
          trace: (arg: number) => console.log(arg),
        },
      })
    ).instance;

    // --- #1
    const canvas1 = document.getElementById("canvas1") as HTMLCanvasElement;
    const ctx1 = canvas1.getContext("2d");
    const start1 = performance.now();
    (instance.exports as any).image1();
    const end1 = performance.now();
    (document.getElementById("label1") as HTMLHeadElement)
      .textContent = `32-bit addressing: ${(end1 - start1).toFixed(4)} ms`;
    const imgData1 = ctx1.createImageData(WIDTH, HEIGHT);
    const linearMemory1 = new Uint8Array(
      (instance.exports.memory as any).buffer,
      0,
      WIDTH * HEIGHT * 4
    );
    imgData1.data.set(linearMemory1);
    ctx1.putImageData(imgData1, 0, 0);

    // --- #2
    const canvas2 = document.getElementById("canvas2") as HTMLCanvasElement;
    const ctx2 = canvas2.getContext("2d");
    const start2 = performance.now();
    (instance.exports as any).image2();
    const end2 = performance.now();
    (document.getElementById("label2") as HTMLHeadElement)
      .textContent = `8-bit addressing: ${(end2 - start2).toFixed(4)} ms`;
    const imgData2 = ctx2.createImageData(WIDTH, HEIGHT);
    const linearMemory2 = new Uint8Array(
      (instance.exports.memory as any).buffer,
      0,
      WIDTH * HEIGHT * 4
    );
    imgData2.data.set(linearMemory2);
    ctx2.putImageData(imgData2, 0, 0);

    // --- #3
    const canvas3 = document.getElementById("canvas3") as HTMLCanvasElement;
    const ctx3 = canvas3.getContext("2d");
    const start3 = performance.now();
    const linearMemory3 = new Uint8Array(WIDTH * HEIGHT * 4);
    for (let x = 0; x < WIDTH; x++) {
      for (let y = 0; y < HEIGHT; y++) {
        const addr = (y * WIDTH + x) * 4;
        linearMemory3[addr] = (x+y) & 0xff;
        linearMemory3[addr + 1] = (x-y) & 0xff;
        linearMemory3[addr + 2] = 0;
        linearMemory3[addr + 3] = 255;
      }
    }

    const end3 = performance.now();
    (document.getElementById("label3") as HTMLHeadElement)
      .textContent = `JavaScript: ${(end3 - start3).toFixed(4)} ms`;
    const imgData3 = ctx3.createImageData(WIDTH, HEIGHT);
    imgData3.data.set(linearMemory3);
    ctx3.putImageData(imgData3, 0, 0);

  } catch (err) {
    console.log(err);
  }
})();
