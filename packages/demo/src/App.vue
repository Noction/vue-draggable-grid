<template>
  <button @click="bar">
    asdasd
  </button>
  <grid-layout
    ref="gridLayout"
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
      colNum: 6,
      layout: [
        { x:0, y:0, w:2, h:2, i:0 },
        { x:2, y:0, w:2, h:2, i:1 },
        { x:4, y:0, w:2, h:2, i:2 },
        { x:0, y:2, w:2, h:2, i:3 },
        { x:2, y:2, w:2, h:2, i:4 },
        { x:4, y:2, w:2, h:2, i:5 },
        { x:0, y:4, w:2, h:2, i:6 },
        { x:2, y:4, w:2, h:2, i:7 },
        { x:4, y:4, w:2, h:2, i:8 },
        { x:0, y:6, w:2, h:2, i:9 },
        { x:2, y:6, w:2, h:2, i:10 },
        { x:4, y:6, w:2, h:2, i:11 }
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
    bar () {
      this.$refs.gridLayout.alignGridItems()
    },
    containerResized (e) {
      console.log(e)
    },
    foo () {
      const groupWidgetByHeightInAxis = this.groupWidgetByHeightInAxis(this.layout)
      const yAxis = Object.keys(groupWidgetByHeightInAxis)
      const getLineWidth = line => line.reduce((acc, val) => acc + val.w, 0)

      const req = (lineI = 0, nextLineI = 1) => {
        if (lineI === yAxis.length - 1) return

        const line = groupWidgetByHeightInAxis[yAxis[lineI]]
        const lineWidth = getLineWidth(line)
        const isSpace = lineWidth < 4

        if (!isSpace) return req(lineI + 1, lineI + 2)

        const nextLine = groupWidgetByHeightInAxis?.[yAxis?.[nextLineI]]

        if (!nextLine) return req(lineI + 1, lineI + 1)

        for (let i = 0; i < nextLine.length; i++) {
          const itemFromNextLine = nextLine[i]

          if (itemFromNextLine.w > 4 - lineWidth) continue

          // if height > 1
          const hasInLine = line.find(el => el.i === itemFromNextLine.i)

          if (hasInLine) continue

          const xAxisInLastRow = line.map(w => w.x)
          const xAxisDefaultRow = Array.from({ length: 4 + 1 }, (_, i) => i)

          for (let i = 0; i < xAxisDefaultRow.length - 1; i++) {
            const xAxis = xAxisDefaultRow[i]

            if (!xAxisInLastRow.includes(xAxis)) continue

            const widget = line.find(w => w.x === xAxis)
            const blockArray = Array.from({ length: widget.w }, () => 100)

            xAxisDefaultRow.splice(i, widget.w, ...blockArray)

          }

          const firstEmptyAxis = Math.min(...xAxisDefaultRow)
          const indexOfEmptyXAxis = xAxisDefaultRow.indexOf(firstEmptyAxis)

          if (xAxisDefaultRow[indexOfEmptyXAxis + 1 - 1] !== 100) {
            itemFromNextLine.x = firstEmptyAxis
            itemFromNextLine.y = +yAxis[lineI]
          }

          line.push(itemFromNextLine)

          if (itemFromNextLine.h <= 1) {
            nextLine.splice(i, 1)
          }

          if (itemFromNextLine.h > 1) {
            const nL = groupWidgetByHeightInAxis?.[yAxis?.[nextLineI + 1]]

            nL.splice(i, 1)
          }

          if (getLineWidth(line) > 3) {
            return req(lineI + 1, lineI + 2)
          }
        }

        if (getLineWidth(line) < 4) {
          return req(lineI, nextLineI + 1)
        }
      }

      req()
    },
    groupWidgetByHeightInAxis (layout) {
      // grouping grid by Y-axis
      const groupByRow = layout.reduce((acc, val) => {
        acc[val.y] = (acc?.[val.y] ?? []).concat(val)
        return acc
      }, {})

      // Y-axis of all widgets
      const widgetsYAxis = Object.keys(groupByRow)

      // grouping widgets by height and Y-axis
      // if widget have y: 0, and height: 3 => this widget will be in row 0 and row 2
      return widgetsYAxis.reduce((acc, val) => {
        const widgetsInRow = groupByRow[val]

        acc[val] = (acc[val] ?? []).concat(widgetsInRow)

        widgetsInRow.forEach(el => {
          for (let i = el.y; i < el.h + el.y - 1; i++) {
            const nextYAxis = i + 1

            if (nextYAxis === +val) continue

            acc[nextYAxis] = (acc[nextYAxis] ?? []).concat(el)
          }
        })

        return acc
      }, {})
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
