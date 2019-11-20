import Vue from 'vue'
import { idGen } from './common'

interface ReactiveContainer extends Vue {
  slot: { [key: string]: any }
}

const vInstance: ReactiveContainer = new Vue({
  data: () => ({
    slot: {},
    abc: {}
  }),
})

export default function makeReactive<T>(obj: T): T {
  const id = idGen()
  const target = Vue.set<T>(vInstance.slot, id, obj)
  vInstance.slot[id] = null

  return target
}
