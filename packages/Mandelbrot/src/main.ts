const WIDTH = 1200;
const HEIGHT = 800;
let instance: WebAssembly.Instance | null = null;

(async () => {
  try {
    const response = await fetch("/build/mandelbrot.wasm");
    const wasmBinary = await response.arrayBuffer();
    instance = (
      await WebAssembly.instantiate(wasmBinary, {
        imports: {
          trace: (arg: number) => console.log(arg),
          traced: (arg: number) => console.log(arg),
        },
      })
    ).instance;
    (instance.exports as any).initColors();

    const canvas = document.getElementById("canvas") as HTMLCanvasElement;
    const ctx = canvas.getContext("2d");
    ctx.scale(2, 2);

    // the 'seahorse tail'
    // https://commons.wikimedia.org/wiki/File:Mandel_zoom_04_seehorse_tail.jpg
    const config = {
      x: -0.743644786,
      y: 0.1318252536,
      d: 0.00029336,
    };

    const start = performance.now();
    (instance.exports as any).mandelbrot(config.x, config.y, config.d);
    const end = performance.now();
    console.log(`Execution time: ${end - start}`);
    const imgData = ctx.createImageData(WIDTH, HEIGHT);
    const linearMemory = new Uint8Array(
      (instance.exports.memory as any).buffer,
      0,
      WIDTH * HEIGHT * 4
    );
    imgData.data.set(linearMemory);
    ctx.putImageData(imgData, 0, 0);
  } catch (err) {
    console.log(err);
  }
})();
