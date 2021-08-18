(async () => {
    const response = await fetch("/build/hello.wasm");
    const wasmBinary = await response.arrayBuffer();
    const module = (await WebAssembly.instantiate(wasmBinary)).instance;
    const value = (module.exports as any).multiply(2, 21);
    document.getElementById("container").textContent = value;
})()