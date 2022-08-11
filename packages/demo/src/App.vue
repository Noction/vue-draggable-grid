<template>
  <button @click="editable = !editable">
    asdasd
  </button>
  <grid-layout
    v-model:layout="layout"
    :col-num="colNum"
    @item-resize="containerResized"
  >
    <template #item="slotProps">
      {{ slotProps.item.i }}
      <div>
        asdasdasd
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
      colNum: 12,
      layout: [
        { x:0, y:0, w:2, h:2, i:0 },
        { x:2, y:0, w:2, h:4, i:1 },
        { x:4, y:0, w:2, h:5, i:2 },
        { x:6, y:0, w:2, h:3, i:3 },
        { x:8, y:0, w:2, h:3, i:4 },
        { x:10, y:0, w:2, h:3, i:5 },
        { x:0, y:5, w:2, h:5, i:6 },
        { x:2, y:5, w:2, h:5, i:7 },
        { x:4, y:5, w:2, h:5, i:8 },
        { x:6, y:3, w:2, h:4, i:9 }
      ],
      margin: [10, 10],
      responsiveLayouts: {
        lg: [
          {
            h:4,
            i:0,
            static: true,
            w:4,
            x:0,
            y:0
          },
          {
            h:4,
            i:1,
            w:4,
            x:2,
            y:0
          },
          {
            h:4,
            i:2,
            w:4,
            x:4,
            y:0
          },
          {
            h:4,
            i:3,
            w:4,
            x:6,
            y:0
          }
        ],
        md:  [
          {
            h:3,
            i:0,
            static: true,
            w:3,
            x:0,
            y:0
          },
          {
            h:3,
            i:1,
            w:3,
            x:2,
            y:0
          },
          {
            h:3,
            i:2,
            w:3,
            x:4,
            y:0
          },
          {
            h:3,
            i:3,
            w:3,
            x:6,
            y:0
          }
        ],
        sm: [{
          h:2,
          i:0,
          static: true,
          w:2,
          x:0,
          y:0
        },
        {
          h:2,
          i:1,
          w:2,
          x:2,
          y:0
        },
        {
          h:2,
          i:2,
          w:2,
          x:4,
          y:0
        },
        {
          h:2,
          i:3,
          w:2,
          x:6,
          y:0
        }],
        xs: [{
          h:1,
          i:0,
          static: true,
          w:1,
          x:0,
          y:0
        },
        {
          h:1,
          i:1,
          w:1,
          x:2,
          y:0
        },
        {
          h:1,
          i:2,
          w:1,
          x:4,
          y:0
        },
        {
          h:1,
          i:3,
          w:1,
          x:6,
          y:0
        }],
        xxs: [
          {
            h:1,
            i:0,
            static: true,
            w:2,
            x:0,
            y:0
          },
          {
            h:1,
            i:1,
            w:2,
            x:2,
            y:0
          },
          {
            h:1,
            i:2,
            w:2,
            x:4,
            y:0
          },
          {
            h:1,
            i:3,
            w:2,
            x:6,
            y:0
          }
        ]
      },
      rowHeight: 30
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
    }
  }
})
</script>

<!-- <style lang="scss"> -->
<!-- </style> -->
