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

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'App',
  data () {
    return {
      colNum: 6,
      editable: false,
      layout: [
        { h: 2, i: 0, w: 2, x: 0, y: 0 },
        { h: 2, i: 1, w: 2, x: 2, y: 0 },
        { h: 2, i: 2, w: 2, x: 4, y: 0 },
        { h: 2, i: 3, w: 2, x: 0, y: 2 },
        { h: 2, i: 4, w: 2, x: 2, y: 2 },
        { h: 2, i: 5, w: 2, x: 4, y: 2 },
        { h: 2, i: 6, w: 2, x: 0, y: 4 },
        { h: 2, i: 7, w: 2, x: 2, y: 4 },
        { h: 2, i: 8, w: 2, x: 4, y: 4 },
        { h: 2, i: 9, w: 2, x: 0, y: 6 },
        { h: 2, i: 10, w: 2, x: 2, y: 6 },
        { h: 2, i: 11, w: 2, x: 4, y: 6 }
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
      // eslint-disable-next-line
      // @ts-ignore
      this.$refs.gridLayout.alignGridItems()
    },
    // eslint-disable-next-line
    // @ts-ignore
    containerResized (e) {
      console.log(e)
    },
    foo () {
      const groupWidgetByHeightInAxis = this.groupWidgetByHeightInAxis(this.layout)
      const yAxis = Object.keys(groupWidgetByHeightInAxis)
      // eslint-disable-next-line
      // @ts-ignore
      const getLineWidth = line => line.reduce((acc, val) => acc + val.w, 0)

      // eslint-disable-next-line
      // @ts-ignore
      const req = (lineI = 0, nextLineI = 1) => {
        if (lineI === yAxis.length - 1) return

        // eslint-disable-next-line
        // @ts-ignore
        const line = groupWidgetByHeightInAxis[yAxis[lineI]]
        const lineWidth = getLineWidth(line)
        const isSpace = lineWidth < 4

        if (!isSpace) return req(lineI + 1, lineI + 2)

        // eslint-disable-next-line
        // @ts-ignore
        const nextLine = groupWidgetByHeightInAxis?.[yAxis?.[nextLineI]]

        if (!nextLine) return req(lineI + 1, lineI + 1)

        for (let i = 0; i < nextLine.length; i++) {
          const itemFromNextLine = nextLine[i]

          if (itemFromNextLine.w > 4 - lineWidth) continue

          // if height > 1
          // eslint-disable-next-line
          // @ts-ignore
          const hasInLine = line.find(el => el.i === itemFromNextLine.i)

          if (hasInLine) continue

          // eslint-disable-next-line
          // @ts-ignore
          const xAxisInLastRow = line.map(w => w.x)
          const xAxisDefaultRow = Array.from({ length: 4 + 1 }, (_, i) => i)

          for (let i = 0; i < xAxisDefaultRow.length - 1; i++) {
            const xAxis = xAxisDefaultRow[i]

            if (!xAxisInLastRow.includes(xAxis)) continue

            // eslint-disable-next-line
            // @ts-ignore
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
            // eslint-disable-next-line
            // @ts-ignore
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
    // eslint-disable-next-line
    // @ts-ignore
    groupWidgetByHeightInAxis (layout) {
      // grouping grid by Y-axis
      // eslint-disable-next-line
      // @ts-ignore
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

        // eslint-disable-next-line
        // @ts-ignore
        acc[val] = (acc[val] ?? []).concat(widgetsInRow)

        // eslint-disable-next-line
        // @ts-ignore
        widgetsInRow.forEach(el => {
          for (let i = el.y; i < el.h + el.y - 1; i++) {
            const nextYAxis = i + 1

            if (nextYAxis === +val) continue

            // eslint-disable-next-line
            // @ts-ignore
            acc[nextYAxis] = (acc[nextYAxis] ?? []).concat(el)
          }
        })

        return acc
      }, {})
    }
  }
})
</script>
