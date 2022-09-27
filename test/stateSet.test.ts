import { expect } from 'chai'
import { loadDescription, newTx } from './helper'
import { buildContractClass, buildTypeClasses } from '../src/contract'
import { Bytes, HashedSet, SortedItem, Struct } from '../src/scryptTypes'
import { findKeyIndex, toData, toHashedSet } from '../src/internal'
import { mvc, toHex, getPreimage } from '../src/utils'
const inputIndex = 0
const inputSatoshis = 100000
const outputAmount = inputSatoshis

describe('test.stateSet', () => {
  describe('stateSet', () => {
    let stateSet, StateSet

    let set = new Set<number>()

    before(() => {
      const jsonDescr = loadDescription('stateSet_desc.json')
      StateSet = buildContractClass(jsonDescr)
      stateSet = new StateSet(toHashedSet(set)) // empty initial set
    })

    function buildTx(set: Set<number>) {
      let newLockingScript = stateSet.getNewStateScript({
        set: toHashedSet(set),
      })

      const tx = newTx(inputSatoshis)
      tx.addOutput(
        new mvc.Transaction.Output({
          script: newLockingScript,
          satoshis: outputAmount,
        }),
      )

      stateSet.txContext = {
        tx: tx,
        inputIndex,
        inputSatoshis,
      }

      return tx
    }

    it('test insert', () => {
      function testInsert(key: number) {
        set.add(key)
        const tx = buildTx(set)
        const preimage = getPreimage(tx, stateSet.lockingScript, inputSatoshis)
        const result = stateSet
          .insert(
            new SortedItem({
              item: key,
              idx: findKeyIndex(set, key),
            }),
            preimage,
          )
          .verify()
        expect(result.success, result.error).to.be.true
        stateSet.set = toHashedSet(set)
      }

      testInsert(3)
      testInsert(5)
      testInsert(0)
      testInsert(1)
    })

    it('test delete', () => {
      function testDelete(key: number, expectedResult: boolean = true) {
        const keyIndex = findKeyIndex(set, key)
        set.delete(key)

        const tx = buildTx(set)
        const preimage = getPreimage(tx, stateSet.lockingScript, inputSatoshis)

        const result = stateSet.delete(key, keyIndex, preimage).verify()
        expect(result.success, result.error).to.be.eq(expectedResult)

        stateSet.set = toHashedSet(set)
      }

      testDelete(1)

      testDelete(5)

      testDelete(5, false)
      testDelete(3333, false)

      testDelete(3)

      testDelete(0)
    })
  })
})
