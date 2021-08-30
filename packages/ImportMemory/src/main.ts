const WIDTH = 200;
const HEIGHT = 200;

let memory: WebAssembly.Memory;
let module1: WebAssembly.Instance;
let module2: WebAssembly.Instance;
let module3: WebAssembly.Instance;
let module4: WebAssembly.Instance;

(async () => {
  memory = new WebAssembly.Memory({ initial: 3, maximum: 10 });

  const response1 = await fetch("/build/init-shape.wasm");
  const wasmBinary1 = await response1.arrayBuffer();
  module1 = (
    await WebAssembly.instantiate(wasmBinary1, { js: { mem: memory } })
  ).instance;
  (module1.exports as any).initShape();
  displaySharedShape();
  const response2 = await fetch("/build/add-red.wasm");
  const wasmBinary2 = await response2.arrayBuffer();
  module2 = (
    await WebAssembly.instantiate(wasmBinary2, { js: { mem: memory } })
  ).instance;
  const response3 = await fetch("/build/add-green.wasm");
  const wasmBinary3 = await response3.arrayBuffer();
  module3 = (
    await WebAssembly.instantiate(wasmBinary3, { js: { mem: memory } })
  ).instance;
  const response4 = await fetch("/build/add-blue.wasm");
  const wasmBinary4 = await response4.arrayBuffer();
  module4 = (
    await WebAssembly.instantiate(wasmBinary4, { js: { mem: memory } })
  ).instance;
})();

function displaySharedShape() {
  const canvas = document.getElementById("canvas1") as HTMLCanvasElement;
  const ctx = canvas.getContext("2d");
  const imgData = ctx.createImageData(WIDTH, HEIGHT);
  const linearMemory = new Uint8Array(memory.buffer, 0, WIDTH * HEIGHT * 4);
  console.log(linearMemory.length);
  imgData.data.set(linearMemory);
  ctx.putImageData(imgData, 0, 0);
}

function initShape() {
  (module1.exports as any).initShape();
  displaySharedShape();
}

function addRed() {
  const canvas = document.getElementById("canvas2") as HTMLCanvasElement;
  const ctx = canvas.getContext("2d");
  (module2.exports as any).addRed();
  const imgData = ctx.createImageData(WIDTH, HEIGHT);
  const linearMemory = new Uint8Array(memory.buffer, 0, WIDTH * HEIGHT * 4);
  imgData.data.set(linearMemory);
  ctx.putImageData(imgData, 0, 0);
  displaySharedShape();
}

function addGreen() {
  const canvas = document.getElementById("canvas3") as HTMLCanvasElement;
  const ctx = canvas.getContext("2d");
  (module3.exports as any).addGreen();
  const imgData = ctx.createImageData(WIDTH, HEIGHT);
  const linearMemory = new Uint8Array(memory.buffer, 0, WIDTH * HEIGHT * 4);
  imgData.data.set(linearMemory);
  ctx.putImageData(imgData, 0, 0);
  displaySharedShape();
}

function addBlue() {
  const canvas = document.getElementById("canvas4") as HTMLCanvasElement;
  const ctx = canvas.getContext("2d");
  (module4.exports as any).addBlue();
  const imgData = ctx.createImageData(WIDTH, HEIGHT);
  const linearMemory = new Uint8Array(memory.buffer, 0, WIDTH * HEIGHT * 4);
  imgData.data.set(linearMemory);
  ctx.putImageData(imgData, 0, 0);
  displaySharedShape();
}
