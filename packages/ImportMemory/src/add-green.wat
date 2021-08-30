(module
  (memory (import "js" "mem") 1)
  (export "addGreen" (func $addGreen))

  (func $addGreen 
    (local $index i32)
    (local $address i32)
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
        tee_local $address
        i32.const 0xff
        i32.store8 offset=3
        get_local $address
        get_local $address
        i32.load8_u offset=1
        i32.const 0x20
        i32.add
        i32.store8 offset=1
        br $pixels
      end
    end
  )
)
