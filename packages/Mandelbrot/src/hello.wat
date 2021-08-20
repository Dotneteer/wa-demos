(module
  (export "multiply" (func $multiply))

  (func $multiply (param $a i32) (param $b i32) (result i32)
    get_local $a
    get_local $b
    i32.mul)
)
