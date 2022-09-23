<template>
  <button @click="foo">
    asdasd
  </button>
  <grid-layout
    v-model:layout="layout"
    :col-num="colNum"
    :row-height="rowHeight"
    @item-resize="containerResized"
  >
    <template #gridItemContent="slotProps">
      <div>
        {{ slotProps.item.i }}
      </div>
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
      colNum: 4,
      layout: [
        { x:0, y:0, w:1, h:1, i:0 },
        { x:1, y:0, w:1, h:1, i:1 },
        { x:2, y:0, w:1, h:1, i:2 },
        { x:3, y:0, w:1, h:1, i:3 },
        { x:0, y:1, w:1, h:1, i:4 },
        { x:1, y:1, w:1, h:1, i:5 },
        { x:2, y:1, w:1, h:1, i:6 },
        { x:3, y:1, w:1, h:1, i:7 },
        { x:0, y:2, w:1, h:1, i:8 },
        { x:1, y:2, w:1, h:1, i:9 },
        { x:2, y:2, w:1, h:1, i:10 },
        { x:3, y:2, w:1, h:1, i:11 }
      ],
      margin: [10, 10]
    }
  },
  computed: {
    rowHeight () {
      return (window.innerWidth - 56) / 4
    }
  },
  mounted () {
    setTimeout(() => {
      // this.rowHeight = 50
    }, 5000)
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
        w: 3,
        h: 3,
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
