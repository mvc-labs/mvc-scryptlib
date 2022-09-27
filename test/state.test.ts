import { assert, expect } from 'chai'
import { loadDescription, newTx } from './helper'
import { buildContractClass, buildTypeClasses } from '../src/contract'
import {
  Bool,
  Bytes,
  Int,
  PrivKey,
  PubKey,
  Ripemd160,
  Sha256,
  SigHashPreimage,
  SigHashType,
  OpCodeType,
  SigHash,
  Sig,
} from '../src/scryptTypes'
import { mvc, toHex, getPreimage } from '../src/utils'

const inputIndex = 0
const inputSatoshis = 100000

const outputAmount = 222222

const StateExample = buildContractClass(loadDescription('state_desc.json'))

describe('state_test', () => {
  it('should serializer state success', () => {
    const stateExample = new StateExample(
      1000,
      new Bytes('0101'),
      true,
      new PrivKey('11'),
      new PubKey('03f4a8ec3e44903ea28c00113b351af3baeec5662e5e2453c19188fbcad00fb1cf'),
      new Ripemd160('40933785f6695815a7e1afb59aff20226bbb5bd4'),
      new Sha256('ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad'),
      new OpCodeType('76'),
      new SigHashType(SigHash.ALL | SigHash.FORKID),
      new Sig(
        '304402207b6ce0aaae3a379721a364ab11414abd658a9940c10d48cd0bc6b273e81d058902206f6c0671066aef4c0de58ab8c349fde38ef3ea996b9f2e79241ebad96049299541',
      ),
    )

    expect(stateExample.dataPart.toHex()).to.be.equal('01010001000101000100010001000100010001001400000000')
    stateExample.counter++
    stateExample.state_bytes = new Bytes('010101')
    stateExample.state_bool = false

    expect(stateExample.dataPart.toHex()).to.be.equal('000101030101010001000100010001000100010001001600000000')
  })

  it('should deserializer state success 1', () => {
    const stateExample = new StateExample(
      0,
      new Bytes(''),
      false,
      new PrivKey('3'),
      new PubKey('01'),
      new Ripemd160('02'),
      new Sha256('03'),
      new OpCodeType('76'),
      new SigHashType(SigHash.ALL | SigHash.FORKID),
      new Sig('05'),
    )

    expect(stateExample.dataPart.toHex()).to.be.eq('01010001000101000100010001000100010001001400000000')

    let newStateExample = StateExample.fromHex(stateExample.lockingScript.toHex())

    expect(newStateExample.dataPart.toHex()).to.be.eq('01010001000101000100010001000100010001001400000000')

    expect(newStateExample.counter.equals(new Int(0))).to.be.true
    expect(newStateExample.state_bytes.equals(new Bytes('00'))).to.be.true
    expect(newStateExample.state_bool.equals(new Bool(true))).to.be.true

    expect(newStateExample.pubkey.equals(new PubKey('00'))).to.be.true
    expect(newStateExample.privKey.equals(new PrivKey(0))).to.be.true
    expect(newStateExample.ripemd160.equals(new Ripemd160('00'))).to.be.true
    expect(newStateExample.sha256.equals(new Sha256('00'))).to.be.true
    expect(newStateExample.opCodeType.equals(new OpCodeType('00'))).to.be.true
    expect(newStateExample.sigHashType.equals(new SigHashType(0))).to.be.true
    expect(newStateExample.sig.equals(new Sig('00'))).to.be.true
  })

  it('should deserializer state success 2', () => {
    const stateExample = new StateExample(
      3,
      new Bytes(''),
      false,
      new PrivKey('3'),
      new PubKey('01'),
      new Ripemd160('02'),
      new Sha256('03'),
      new OpCodeType('76'),
      new SigHashType(SigHash.ALL | SigHash.FORKID),
      new Sig('05'),
    )

    stateExample.counter = 3
    expect(stateExample.dataPart.toHex()).to.be.eq('00010301000101000100010001000100010001001400000000')

    let newStateExample = StateExample.fromHex(stateExample.lockingScript.toHex())

    expect(newStateExample.counter.equals(new Int(3))).to.be.true
  })

  it('should deserializer state success 2', () => {
    const stateExample = new StateExample(
      1000,
      new Bytes('0101'),
      true,
      new PrivKey('11'),
      new PubKey('03f4a8ec3e44903ea28c00113b351af3baeec5662e5e2453c19188fbcad00fb1cf'),
      new Ripemd160('40933785f6695815a7e1afb59aff20226bbb5bd4'),
      new Sha256('ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad'),
      new OpCodeType('76'),
      new SigHashType(SigHash.ALL | SigHash.FORKID),
      new Sig(
        '304402207b6ce0aaae3a379721a364ab11414abd658a9940c10d48cd0bc6b273e81d058902206f6c0671066aef4c0de58ab8c349fde38ef3ea996b9f2e79241ebad96049299541',
      ),
    )

    stateExample.counter = 1000
    stateExample.state_bytes = new Bytes('0101')
    stateExample.state_bool = true
    stateExample.privKey = new PrivKey('11')
    stateExample.ripemd160 = new Ripemd160('40933785f6695815a7e1afb59aff20226bbb5bd4')
    stateExample.sha256 = new Sha256('ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad')
    stateExample.opCodeType = new OpCodeType('76')
    stateExample.sigHashType = new SigHashType(SigHash.ALL | SigHash.FORKID)
    stateExample.sig = new Sig(
      '304402207b6ce0aaae3a379721a364ab11414abd658a9940c10d48cd0bc6b273e81d058902206f6c0671066aef4c0de58ab8c349fde38ef3ea996b9f2e79241ebad96049299541',
    )

    let newStateExample = StateExample.fromHex(stateExample.lockingScript.toHex())

    expect(newStateExample.counter.equals(new Int(1000))).to.be.true
    expect(newStateExample.state_bytes.equals(new Bytes('0101'))).to.be.true
    expect(newStateExample.state_bool.equals(new Bool(true))).to.be.true
    expect(newStateExample.privKey.equals(new PrivKey('11'))).to.be.true
    expect(newStateExample.ripemd160.equals(new Ripemd160('40933785f6695815a7e1afb59aff20226bbb5bd4'))).to.be.true
    expect(
      newStateExample.sha256.equals(new Sha256('ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad')),
    ).to.be.true
    expect(newStateExample.opCodeType.equals(new OpCodeType('76'))).to.be.true
    expect(newStateExample.sigHashType.equals(new SigHashType(SigHash.ALL | SigHash.FORKID))).to.be.true
    expect(
      newStateExample.sig.equals(
        new Sig(
          '304402207b6ce0aaae3a379721a364ab11414abd658a9940c10d48cd0bc6b273e81d058902206f6c0671066aef4c0de58ab8c349fde38ef3ea996b9f2e79241ebad96049299541',
        ),
      ),
    ).to.be.true
  })

  it('should call success', () => {
    const stateExample = new StateExample(
      1000,
      new Bytes('0101'),
      true,
      new PrivKey('11'),
      new PubKey('03f4a8ec3e44903ea28c00113b351af3baeec5662e5e2453c19188fbcad00fb1cf'),
      new Ripemd160('40933785f6695815a7e1afb59aff20226bbb5bd4'),
      new Sha256('ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad'),
      new OpCodeType('76'),
      new SigHashType(SigHash.ALL | SigHash.FORKID),
      new Sig(
        '304402207b6ce0aaae3a379721a364ab11414abd658a9940c10d48cd0bc6b273e81d058902206f6c0671066aef4c0de58ab8c349fde38ef3ea996b9f2e79241ebad96049299541',
      ),
    )

    stateExample.counter = 1000
    stateExample.state_bytes = new Bytes('0101')
    stateExample.state_bool = true
    stateExample.privKey = new PrivKey('11')
    stateExample.ripemd160 = new Ripemd160('40933785f6695815a7e1afb59aff20226bbb5bd4')
    stateExample.sha256 = new Sha256('ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad')
    stateExample.opCodeType = new OpCodeType('76')
    stateExample.sigHashType = new SigHashType(SigHash.ALL | SigHash.FORKID)
    stateExample.sig = new Sig(
      '304402207b6ce0aaae3a379721a364ab11414abd658a9940c10d48cd0bc6b273e81d058902206f6c0671066aef4c0de58ab8c349fde38ef3ea996b9f2e79241ebad96049299541',
    )

    let newLockingScript = stateExample.getNewStateScript({
      counter: 1001,
      state_bytes: new Bytes('010101'),
      state_bool: false,
      privKey: new PrivKey('11'),
      ripemd160: new Ripemd160('40933785f6695815a7e1afb59aff20226bbb5bd4'),
      sha256: new Sha256('ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad'),
      opCodeType: new OpCodeType('76'),
      sigHashType: new SigHashType(SigHash.ALL | SigHash.FORKID),
      sig: new Sig(
        '304402207b6ce0aaae3a379721a364ab11414abd658a9940c10d48cd0bc6b273e81d058902206f6c0671066aef4c0de58ab8c349fde38ef3ea996b9f2e79241ebad96049299541',
      ),
    })

    const tx1 = newTx(inputSatoshis)
    tx1.addOutput(
      new mvc.Transaction.Output({
        script: newLockingScript,
        satoshis: outputAmount,
      }),
    )

    const preimage1 = getPreimage(tx1, stateExample.lockingScript, inputSatoshis)

    stateExample.txContext = {
      tx: tx1,
      inputIndex,
      inputSatoshis,
    }

    const result1 = stateExample.unlock(new SigHashPreimage(toHex(preimage1)), outputAmount).verify()
    expect(result1.success, result1.error).to.be.true

    // update state
    stateExample.counter = 1001
    stateExample.state_bytes = new Bytes('010101')
    stateExample.state_bool = false
    stateExample.privKey = new PrivKey('11')
    stateExample.ripemd160 = new Ripemd160('40933785f6695815a7e1afb59aff20226bbb5bd4')
    stateExample.sha256 = new Sha256('ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad')
    stateExample.opCodeType = new OpCodeType('76')
    stateExample.sigHashType = new SigHashType(SigHash.ALL | SigHash.FORKID)
    stateExample.sig = new Sig(
      '304402207b6ce0aaae3a379721a364ab11414abd658a9940c10d48cd0bc6b273e81d058902206f6c0671066aef4c0de58ab8c349fde38ef3ea996b9f2e79241ebad96049299541',
    )

    newLockingScript = stateExample.getNewStateScript({
      counter: 1002,
      state_bytes: new Bytes('01010101'),
      state_bool: true,
      privKey: new PrivKey('11'),
      ripemd160: new Ripemd160('40933785f6695815a7e1afb59aff20226bbb5bd4'),
      sha256: new Sha256('ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad'),
      opCodeType: new OpCodeType('76'),
      sigHashType: new SigHashType(SigHash.ALL | SigHash.FORKID),
      sig: new Sig(
        '304402207b6ce0aaae3a379721a364ab11414abd658a9940c10d48cd0bc6b273e81d058902206f6c0671066aef4c0de58ab8c349fde38ef3ea996b9f2e79241ebad96049299541',
      ),
    })

    const tx2 = newTx(inputSatoshis)
    tx2.addOutput(
      new mvc.Transaction.Output({
        script: newLockingScript,
        satoshis: outputAmount,
      }),
    )

    const preimage2 = getPreimage(tx2, stateExample.lockingScript, inputSatoshis)

    stateExample.txContext = {
      tx: tx2,
      inputIndex,
      inputSatoshis,
    }

    const result2 = stateExample.unlock(new SigHashPreimage(toHex(preimage2)), outputAmount).verify()
    expect(result2.success, result2.error).to.be.true
  })

  it('should throw if providing non-existent state', () => {
    const stateExample = new StateExample(
      1000,
      new Bytes('0101'),
      true,
      new PrivKey('11'),
      new PubKey('03f4a8ec3e44903ea28c00113b351af3baeec5662e5e2453c19188fbcad00fb1cf'),
      new Ripemd160('40933785f6695815a7e1afb59aff20226bbb5bd4'),
      new Sha256('ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad'),
      new OpCodeType('76'),
      new SigHashType(SigHash.ALL | SigHash.FORKID),
      new Sig(
        '304402207b6ce0aaae3a379721a364ab11414abd658a9940c10d48cd0bc6b273e81d058902206f6c0671066aef4c0de58ab8c349fde38ef3ea996b9f2e79241ebad96049299541',
      ),
    )

    expect(() => {
      stateExample.getNewStateScript({
        coun1ter: 1002,
        state_bytes: new Bytes('01010101'),
        state_bool: true,
      })
    }).to.throw('Contract StateExample does not have stateful property coun1ter')
  })

  it('should throw if constract does not have any stateful property', () => {
    const Counter = buildContractClass(loadDescription('counter_desc.json'))
    let counter = new Counter()

    expect(() => {
      counter.getNewStateScript({
        coun1ter: 1002,
        state_bytes: new Bytes('01010101'),
        state_bool: true,
      })
    }).to.throw('Contract Counter does not have any stateful property')
  })

  it('should succeeding when not all state properties are provided in getNewStateScript() ', () => {
    const StateCounter = buildContractClass(loadDescription('statecounter_desc.json'))
    let counter = new StateCounter(0, true)

    let newLockingScript = counter.getNewStateScript({
      counter: 1,
    })

    const tx = newTx(inputSatoshis)
    tx.addOutput(
      new mvc.Transaction.Output({
        script: newLockingScript,
        satoshis: outputAmount,
      }),
    )

    const preimage = getPreimage(tx, counter.lockingScript, inputSatoshis)

    counter.txContext = {
      tx: tx,
      inputIndex,
      inputSatoshis,
    }

    const result2 = counter.increment(new SigHashPreimage(toHex(preimage)), outputAmount).verify()
    expect(result2.success, result2.error).to.be.true
  })

  it('should fail when wrong value state properties are provided in getNewStateScript() ', () => {
    const StateCounter = buildContractClass(loadDescription('statecounter_desc.json'))
    let counter = new StateCounter(0, true)

    let newLockingScript = counter.getNewStateScript({
      counter: 1,
      done: false,
    })

    const tx = newTx(inputSatoshis)
    tx.addOutput(
      new mvc.Transaction.Output({
        script: newLockingScript,
        satoshis: outputAmount,
      }),
    )

    const preimage = getPreimage(tx, counter.lockingScript, inputSatoshis)

    counter.txContext = {
      tx: tx,
      inputIndex,
      inputSatoshis,
    }

    const result2 = counter.increment(new SigHashPreimage(toHex(preimage)), outputAmount).verify()
    expect(result2.success, result2.error).to.be.false
  })

  it('should succeeding when state contract with a constructor with a param', () => {
    const StateCounter = buildContractClass(loadDescription('statecounter1_desc.json'))
    let counter = new StateCounter(6)

    let newLockingScript = counter.getNewStateScript({
      counter: 8,
    })

    const tx = newTx(inputSatoshis)
    tx.addOutput(
      new mvc.Transaction.Output({
        script: newLockingScript,
        satoshis: outputAmount,
      }),
    )

    const preimage = getPreimage(tx, counter.lockingScript, inputSatoshis)

    counter.txContext = {
      tx: tx,
      inputIndex,
      inputSatoshis,
    }

    const result = counter.increment(new SigHashPreimage(toHex(preimage)), outputAmount).verify()
    expect(result.success, result.error).to.be.true
  })

  it('should succeeding when state contract with a constructor with two param', () => {
    const StateCounter = buildContractClass(loadDescription('statecounter2_desc.json'))
    let counter = new StateCounter(1, 2)

    let newLockingScript = counter.getNewStateScript({
      counter: 202,
    })

    const tx = newTx(inputSatoshis)
    tx.addOutput(
      new mvc.Transaction.Output({
        script: newLockingScript,
        satoshis: outputAmount,
      }),
    )

    const preimage = getPreimage(tx, counter.lockingScript, inputSatoshis)

    counter.txContext = {
      tx: tx,
      inputIndex,
      inputSatoshis,
    }

    const result = counter.increment(new SigHashPreimage(toHex(preimage)), outputAmount).verify()
    expect(result.success, result.error).to.be.true
  })

  it('should succeeding when state contract with a constructor with a struct param and an array param', () => {
    const StateCounter = buildContractClass(loadDescription('statecounter3_desc.json'))

    const { StructY } = buildTypeClasses(StateCounter)

    let counter = new StateCounter(
      new StructY({
        p1: 1,
        p2: true,
        p3: [1, 1, 1],
      }),
      [1, 1, 12],
    )

    let newLockingScript = counter.getNewStateScript({
      counter: 19,
    })

    const tx = newTx(inputSatoshis)
    tx.addOutput(
      new mvc.Transaction.Output({
        script: newLockingScript,
        satoshis: outputAmount,
      }),
    )

    const preimage = getPreimage(tx, counter.lockingScript, inputSatoshis)

    counter.txContext = {
      tx: tx,
      inputIndex,
      inputSatoshis,
    }

    const result = counter.increment(new SigHashPreimage(toHex(preimage)), outputAmount).verify()
    expect(result.success, result.error).to.be.true
  })

  it('should succeeding when state property is struct', () => {
    const Counter = buildContractClass(loadDescription('ststate_desc.json'))
    const { States, MyStates } = buildTypeClasses(loadDescription('ststate_desc.json'))
    let counter = new Counter(
      new States({
        counter: 1000,
        done: true,
        hex: new Bytes('02'),
      }),
    )

    let newLockingScript = counter.getNewStateScript({
      states: new MyStates({
        counter: 1001,
        done: false,
        hex: new Bytes('0201'),
      }),
    })

    const tx = newTx(inputSatoshis)
    tx.addOutput(
      new mvc.Transaction.Output({
        script: newLockingScript,
        satoshis: outputAmount,
      }),
    )

    const preimage = getPreimage(tx, counter.lockingScript, inputSatoshis)

    counter.txContext = {
      tx: tx,
      inputIndex,
      inputSatoshis,
    }

    const result = counter.increment(new SigHashPreimage(toHex(preimage)), outputAmount).verify()
    expect(result.success, result.error).to.be.true
  })

  it('should succeeding when state property is array', () => {
    const Counter = buildContractClass(loadDescription('arraystate_desc.json'))
    let counter = new Counter([0, 1, 2])

    let newLockingScript = counter.getNewStateScript({
      counters: [1, 2, 3],
    })

    const tx = newTx(inputSatoshis)
    tx.addOutput(
      new mvc.Transaction.Output({
        script: newLockingScript,
        satoshis: outputAmount,
      }),
    )

    const preimage = getPreimage(tx, counter.lockingScript, inputSatoshis)

    counter.txContext = {
      tx: tx,
      inputIndex,
      inputSatoshis,
    }

    const result = counter.increment(new SigHashPreimage(toHex(preimage)), outputAmount).verify()
    expect(result.success, result.error).to.be.true
  })

  it('should succeeding state property is mix struct and array', () => {
    const Counter = buildContractClass(loadDescription('mixstate_desc.json'))
    const { States, StatesA } = buildTypeClasses(loadDescription('mixstate_desc.json'))
    let counter = new Counter(
      new States({
        counter: 1000,
        done: true,
      }),
      [
        new StatesA({
          states: [
            new States({
              counter: 0,
              done: true,
            }),
            new States({
              counter: 1,
              done: false,
            }),
          ],
          hex: new Bytes('02'),
        }),
      ],
    )

    let newLockingScript = counter.getNewStateScript({
      states: new States({
        counter: 1001,
        done: false,
      }),
      sss: [
        new StatesA({
          states: [
            new States({
              counter: 0,
              done: true,
            }),
            new States({
              counter: 1,
              done: false,
            }),
          ],
          hex: new Bytes('0201'),
        }),
      ],
    })

    const tx = newTx(inputSatoshis)
    tx.addOutput(
      new mvc.Transaction.Output({
        script: newLockingScript,
        satoshis: outputAmount,
      }),
    )

    const preimage = getPreimage(tx, counter.lockingScript, inputSatoshis)

    counter.txContext = {
      tx: tx,
      inputIndex,
      inputSatoshis,
    }

    const result = counter.increment(new SigHashPreimage(toHex(preimage)), outputAmount).verify()
    expect(result.success, result.error).to.be.true
  })

  it('should fail state property with wrong value', () => {
    const Counter = buildContractClass(loadDescription('mixstate_desc.json'))
    const { States, StatesA } = buildTypeClasses(loadDescription('mixstate_desc.json'))
    let counter = new Counter(
      new States({
        counter: 1000,
        done: true,
      }),
      [
        new StatesA({
          states: [
            new States({
              counter: 0,
              done: true,
            }),
            new States({
              counter: 1,
              done: false,
            }),
          ],
          hex: new Bytes('02'),
        }),
      ],
    )

    let newLockingScript = counter.getNewStateScript({
      states: new States({
        counter: 1001,
        done: false,
      }),
      sss: [
        new StatesA({
          states: [
            new States({
              counter: 0,
              done: true,
            }),
            new States({
              counter: 1,
              done: true,
            }),
          ],
          hex: new Bytes('0201'),
        }),
      ],
    })

    const tx = newTx(inputSatoshis)
    tx.addOutput(
      new mvc.Transaction.Output({
        script: newLockingScript,
        satoshis: outputAmount,
      }),
    )

    const preimage = getPreimage(tx, counter.lockingScript, inputSatoshis)

    counter.txContext = {
      tx: tx,
      inputIndex,
      inputSatoshis,
    }

    const result = counter.increment(new SigHashPreimage(toHex(preimage)), outputAmount).verify()
    expect(result.success, result.error).to.be.false
  })
})
