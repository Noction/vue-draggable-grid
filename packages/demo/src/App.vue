<template>
  <button @click="foo">
    asdasd
  </button>
  <grid-layout
    v-model:layout="l"
    :col-num="colNum"
    :row-height="rowHeight"
    @item-resize="containerResized"
  >
    <template #gridItemContent="slotProps">
      {{ slotProps.item.i }}
    </template>
  </grid-layout>
</template>

<script>
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'App',
  data () {
    return {
      editable: false,
      colNum: 12,
      layout: [
        { x:0, y:0, w:3, h:3, i:0 },
        { x:3, y:0, w:3, h:3, i:1 },
        { x:6, y:0, w:3, h:3, i:2 },
        { x:9, y:0, w:3, h:3, i:3 },
        { x:0, y:3, w:3, h:3, i:4 },
        { x:3, y:3, w:3, h:3, i:5 },
        { x:6, y:3, w:3, h:3, i:6 },
        { x:9, y:3, w:3, h:3, i:7 },
        { x:0, y:6, w:3, h:3, i:8 }
        // { x:3, y:6, w:3, h:3, i:9 },
        // { x:6, y:6, w:3, h:3, i:10 },
        // { x:9, y:6, w:3, h:3, i:11 },
        // { x:0, y:9, w:3, h:3, i:12 },
        // { x:3, y:9, w:3, h:3, i:13 },
        // { x:6, y:9, w:3, h:3, i:14 },
        // { x:9, y:9, w:3, h:3, i:15 },
        // { x:0, y:12, w:3, h:3, i:16 },
        // { x:3, y:12, w:3, h:3, i:17 },
        // { x:6, y:12, w:3, h:3, i:18 },
        // { x:9, y:12, w:3, h:3, i:19 },
        // { x:0, y:15, w:3, h:3, i:20 },
        // { x:3, y:15, w:3, h:3, i:21 },
        // { x:6, y:15, w:3, h:3, i:22 },
        // { x:9, y:15, w:3, h:3, i:23 }
      ],
      l: undefined,
      margin: [10, 10]
    }
  },
  computed: {
    rowHeight () {
      return (window.innerWidth - 56) / 12
    }
  },
  mounted () {
    setTimeout(() => {
      this.l = this.layout
    }, 0)
  },
  methods: {
    containerResized (e) {
      console.log(e)
    },
    foo () {
      const lastLayoutItem = this.layout[this.layout.length - 1]
      const newIndex = lastLayoutItem.i + 1
      const { y, x } = lastLayoutItem
      const isFullLine = this.layout.filter(l => l.y === y).length === 4
      const newY = isFullLine ? y + 3 : y
      const newX = isFullLine ? 0 : x + 3

      const newGridItem = {
        x: newX,
        y: newY,
        w: 6,
        h: 6,
        index: newIndex
      }

      this.layout.push(newGridItem)
    }
  }
})
</script>

<!-- <style lang="scss"> -->
<!-- </style> -->

<!-- responsiveLayouts: { -->
<!-- lg: [ -->
<!-- { -->
<!-- h:4, -->
<!-- i:0, -->
<!-- static: true, -->
<!-- w:4, -->
<!-- x:0, -->
<!-- y:0 -->
<!-- }, -->
<!-- { -->
<!-- h:4, -->
<!-- i:1, -->
<!-- w:4, -->
<!-- x:2, -->
<!-- y:0 -->
<!-- }, -->
<!-- { -->
<!-- h:4, -->
<!-- i:2, -->
<!-- w:4, -->
<!-- x:4, -->
<!-- y:0 -->
<!-- }, -->
<!-- { -->
<!-- h:4, -->
<!-- i:3, -->
<!-- w:4, -->
<!-- x:6, -->
<!-- y:0 -->
<!-- } -->
<!-- ], -->
<!-- md:  [ -->
<!-- { -->
<!-- h:3, -->
<!-- i:0, -->
<!-- static: true, -->
<!-- w:3, -->
<!-- x:0, -->
<!-- y:0 -->
<!-- }, -->
<!-- { -->
<!-- h:3, -->
<!-- i:1, -->
<!-- w:3, -->
<!-- x:2, -->
<!-- y:0 -->
<!-- }, -->
<!-- { -->
<!-- h:3, -->
<!-- i:2, -->
<!-- w:3, -->
<!-- x:4, -->
<!-- y:0 -->
<!-- }, -->
<!-- { -->
<!-- h:3, -->
<!-- i:3, -->
<!-- w:3, -->
<!-- x:6, -->
<!-- y:0 -->
<!-- } -->
<!-- ], -->
<!-- sm: [{ -->
<!-- h:2, -->
<!-- i:0, -->
<!-- static: true, -->
<!-- w:2, -->
<!-- x:0, -->
<!-- y:0 -->
<!-- }, -->
<!-- { -->
<!-- h:2, -->
<!-- i:1, -->
<!-- w:2, -->
<!-- x:2, -->
<!-- y:0 -->
<!-- }, -->
<!-- { -->
<!-- h:2, -->
<!-- i:2, -->
<!-- w:2, -->
<!-- x:4, -->
<!-- y:0 -->
<!-- }, -->
<!-- { -->
<!-- h:2, -->
<!-- i:3, -->
<!-- w:2, -->
<!-- x:6, -->
<!-- y:0 -->
<!-- }], -->
<!-- xs: [{ -->
<!-- h:1, -->
<!-- i:0, -->
<!-- static: true, -->
<!-- w:1, -->
<!-- x:0, -->
<!-- y:0 -->
<!-- }, -->
<!-- { -->
<!-- h:1, -->
<!-- i:1, -->
<!-- w:1, -->
<!-- x:2, -->
<!-- y:0 -->
<!-- }, -->
<!-- { -->
<!-- h:1, -->
<!-- i:2, -->
<!-- w:1, -->
<!-- x:4, -->
<!-- y:0 -->
<!-- }, -->
<!-- { -->
<!-- h:1, -->
<!-- i:3, -->
<!-- w:1, -->
<!-- x:6, -->
<!-- y:0 -->
<!-- }], -->
<!-- xxs: [ -->
<!-- { -->
<!-- h:1, -->
<!-- i:0, -->
<!-- static: true, -->
<!-- w:2, -->
<!-- x:0, -->
<!-- y:0 -->
<!-- }, -->
<!-- { -->
<!-- h:1, -->
<!-- i:1, -->
<!-- w:2, -->
<!-- x:2, -->
<!-- y:0 -->
<!-- }, -->
<!-- { -->
<!-- h:1, -->
<!-- i:2, -->
<!-- w:2, -->
<!-- x:4, -->
<!-- y:0 -->
<!-- }, -->
<!-- { -->
<!-- h:1, -->
<!-- i:3, -->
<!-- w:2, -->
<!-- x:6, -->
<!-- y:0 -->
<!-- } -->
<!-- ] -->
<!-- }, -->
