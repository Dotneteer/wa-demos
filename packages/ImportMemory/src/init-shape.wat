(module
  (memory (import "js" "mem") 0)
  (func $trace (import "js" "trace"))

  (export "initShape" (func $initShape))

  (func $initShape 
    (local $index i32)
    call $trace
    i32.const 40000
    set_local $index
    loop $pixels
      get_local $index
      i32.const 1
      i32.sub
      tee_local $index
      i32.const 0
      i32.ge_s
      if
        get_local $index
        i32.const 4
        i32.mul
        i32.const 0xff000000
        i32.store
        br $pixels
      end
    end
  )
)
