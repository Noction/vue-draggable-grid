<template>
  <div
    ref="item"
    class="vue-grid-layout"
    :style="mergedStyle"
  >
    <grid-item
      v-for="item in layout"
      :key="item.i"
      class="item"
      :x="item.x"
      :y="item.y"
      :w="item.w"
      :h="item.h"
      :i="item.i"
      :responsive-parent="responsive"
      :last-breakpoint-parent="lastBreakpoint"
      :breakpoint-cols-parent="cols"
      :col-num-parent="colNum"
      :row-height-parent="rowHeight"
      :width-parent="width"
      :margin-parent="margin"
      :max-rows-parent="maxRows"
      :is-draggable-parent="isDraggable"
      :is-resizable-parent="isResizable"
      :use-css-transforms-parent="useCssTransforms"
    >
      <slot :item="item" />
    </grid-item>
  </div>
</template>

<script lang="ts">
import GridItem from '@/components/GridItem.vue'
import elementResizeDetectorMaker from 'element-resize-detector'
import { Breakpoints, Layout, ResponsiveLayout } from '@/types/helpers'
import { GridLayoutData, GridLayoutEvent } from '@/types/components'
import { PropType, defineComponent } from 'vue'
import { addWindowEventListener, removeWindowEventListener } from '@/helpers/DOM'
import { bottom, cloneLayout, compact, getAllCollisions, getLayoutItem, moveElement, validateLayout } from '@/helpers/utils'
import { findOrGenerateResponsiveLayout, getBreakpointFromWidth, getColsFromBreakpoint } from '@/helpers/responsiveUtils'

const layoutItemRequired = { h: 0, i: '-1', w: 0, x: 0, y: 0 }

export default defineComponent({
  name: 'GridLayout',
  components: {
    GridItem
  },
  provide () {
    return {
      layout: this
    }
  },
  props: {
    autoSize: {
      type: Boolean,
      default: true
    },
    breakpoints: {
      type: Object as PropType<Breakpoints>,
      default: () => ({ lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 })
    },
    colNum: {
      type: Number,
      default: 12
    },
    cols: {
      type: Object as PropType<Breakpoints>,
      default: () => ({ lg: 12, md: 10, sm: 6, xs: 4, xxs: 2 })
    },
    isDraggable: {
      type: Boolean,
      default: true
    },
    isMirrored: {
      type: Boolean,
      default: false
    },
    isResizable: {
      type: Boolean,
      default: true
    },
    layout: {
      type: Array as PropType<Layout>,
      required: true
    },
    margin: {
      type: Array as PropType<number[]>,
      default: () => [10, 10]
    },
    maxRows: {
      type: Number,
      default: Infinity
    },
    preventCollision: {
      type: Boolean,
      default: false
    },
    responsive: {
      type: Boolean,
      default: false
    },
    responsiveLayouts: {
      type: Object as PropType<ResponsiveLayout>,
      default: () => ({})
    },
    rowHeight: {
      type: Number,
      default: 150
    },
    useCssTransforms: {
      type: Boolean,
      default: true
    },
    verticalCompact: {
      type: Boolean,
      default: true
    }
  },
  emits: ['layout-ready', 'update:layout', 'layout-created', 'layout-before-mount', 'layout-mounted', 'layout-updated', 'breakpoint-changed'],
  data (): GridLayoutData {
    return {
      erd: elementResizeDetectorMaker({ callOnAdd: false, strategy: 'scroll' }),
      isDragging: false,
      lastBreakpoint: 'lg', // store last active breakpoint
      lastLayoutLength: 0,
      layouts: {}, // array to store all layouts from different breakpoints
      mergedStyle: {},
      originalLayout: this.layout,
      placeholder: {
        h: 0,
        i: '-1',
        w: 0,
        x: 0,
        y: 0
      },
      width: 0
    }
  },
  watch: {
    colNum (value: number) {
      this.eventBus.emit('set-col-num', value)
    },
    isDraggable (value: boolean) {
      this.eventBus.emit('set-draggable', value)
    },
    isResizable (value: boolean) {
      this.eventBus.emit('set-resizable', value)
    },
    layout () {
      this.layoutUpdate()
    },
    margin (value: [number, number]) {
      this.updateHeight()
      this.eventBus.emit('changed:parent-margin', value)
    },
    maxRows (value: number) {
      this.eventBus.emit('set-max-rows', value)
    },
    responsive (value: boolean) {
      if (!value) {
        this.$emit('update:layout', this.originalLayout)
        this.eventBus.emit('set-col-num', this.colNum)
      }
      this.onWindowResize()
    },
    rowHeight (value: number) {
      this.eventBus.emit('set-row-height', value)
    },
    width (newValue: number, oldValue: number) {
      this.$nextTick( () => {
        this.eventBus.emit('update-width', newValue)
        if (oldValue === null) {
          this.$nextTick(() => {
            this.$emit('layout-ready', this.layout)
          })
        }
        this.updateHeight()
      })
    }
  },
  created () {
    this.eventBus.on('resize-event', this.resizeEvent)
    this.eventBus.on('drag-event', this.dragEvent)

    this.$emit('layout-created', this.layout)
  },
  beforeUnmount () {
    this.eventBus.off('resize-event', this.resizeEvent)
    this.eventBus.off('drag-event', this.dragEvent)

    removeWindowEventListener('resize', this.onWindowResize)
    if (this.erd) {
      this.erd.uninstall(this.$refs.item)
    }
  },
  beforeMount () {
    this.$emit('layout-before-mount', this.layout)
  },
  mounted () {
    this.$emit('layout-mounted', this.layout)
    this.$nextTick( () => {
      validateLayout(this.layout)

      this.originalLayout = this.layout

      this.$nextTick( () => {
        this.onWindowResize()

        this.initResponsiveFeatures()

        //self.width = self.$el.offsetWidth;
        addWindowEventListener('resize', this.onWindowResize.bind(this))

        compact(this.layout, this.verticalCompact)

        this.$emit('layout-updated', this.layout)

        this.updateHeight()
        this.$nextTick( () => {
          this.erd.listenTo(this.$refs.item, () => {
            this.onWindowResize()
          })
        })
      })
    })
  },
  methods: {
    containerHeight (): string | undefined {
      if (!this.autoSize) return

      return `${bottom(this.layout) * (this.rowHeight + this.margin[1]) + this.margin[1]}px`
    },
    dragEvent ([eventName, id, x, y, h, w]: GridLayoutEvent): void {
      //console.log(eventName + " id=" + id + ", x=" + x + ", y=" + y);
      let l = getLayoutItem(this.layout, id)

      //GetLayoutItem sometimes returns null object

      if (!l && (l === undefined || l === null)) {
        l = { ...layoutItemRequired }
      }

      if (eventName === 'dragmove' || eventName === 'dragstart') {
        this.placeholder.i = id
        this.placeholder.x = l.x
        this.placeholder.y = l.y
        this.placeholder.w = w
        this.placeholder.h = h
        this.$nextTick(function () {
          this.isDragging = true
        })
        //this.$broadcast("updateWidth", this.width);
        this.eventBus.emit('update-width', this.width)
      } else {
        this.$nextTick(function () {
          this.isDragging = false
        })
      }

      // Move the element to the dragged location.
      this.$emit('update:layout', moveElement(this.layout, l, x, y, true, this.preventCollision))
      compact(this.layout, this.verticalCompact)
      // needed because vue can't detect changes on array element properties
      this.eventBus.emit('compact')
      this.updateHeight()
      if (eventName === 'dragend') this.$emit('layout-updated', this.layout)
    },
    findDifference (layout: Layout, originalLayout: Layout): Layout {

      //Find values that are in result1 but not in result2
      const uniqueResultOne = layout.filter(function (obj) {
        return !originalLayout.some(function (obj2) {
          return obj.i === obj2.i
        })
      })

      //Find values that are in result2 but not in result1
      const uniqueResultTwo = originalLayout.filter(function (obj) {
        return !layout.some(function (obj2) {
          return obj.i === obj2.i
        })
      })

      //Combine the two arrays of unique entries#
      return uniqueResultOne.concat(uniqueResultTwo)
    },
    initResponsiveFeatures (): void {
      // clear layouts
      this.layouts = Object.assign({}, this.responsiveLayouts)
    },
    layoutUpdate (): void {
      if (this.layout && this.originalLayout) {
        if (this.layout.length !== this.originalLayout.length) {
          // console.log("### LAYOUT UPDATE!", this.layout.length, this.originalLayout.length);

          const diff = this.findDifference(this.layout, this.originalLayout)

          if (diff.length > 0) {
            if (this.layout.length > this.originalLayout.length) {
              this.originalLayout = this.originalLayout.concat(diff)
            } else {
              this.originalLayout = this.originalLayout.filter(obj => {
                return !diff.some(obj2 => {
                  return obj.i === obj2.i
                })
              })
            }
          }

          this.lastLayoutLength = this.layout.length
          this.initResponsiveFeatures()
        }

        compact(this.layout, this.verticalCompact)
        this.eventBus.emit('update-width', this.width)
        this.updateHeight()

        this.$emit('layout-updated', this.layout)
      }
    },
    onWindowResize (): void {
      if (this.$refs && this.$refs.item) {
        this.width = this.$refs.item.offsetWidth
      }
    },
    resizeEvent ([eventName, id, x, y, h, w]: GridLayoutEvent): void {
      let l = getLayoutItem(this.layout, id)

      if (!l) {
        l = { ...layoutItemRequired }
      }

      let hasCollisions

      if (this.preventCollision) {
        const collisions = getAllCollisions(this.layout, { ...l, h, w }).filter(
          layoutItem => layoutItem.i !== l.i
        )

        hasCollisions = collisions.length > 0

        // If we're colliding, we need adjust the placeholder.
        if (hasCollisions) {
          // adjust w && h to maximum allowed space
          let leastX = Infinity,
            leastY = Infinity

          collisions.forEach(layoutItem => {
            if (layoutItem.x > l.x) leastX = Math.min(leastX, layoutItem.x)

            if (layoutItem.y > l.y) leastY = Math.min(leastY, layoutItem.y)
          })

          if (Number.isFinite(leastX)) l.w = leastX - l.x

          if (Number.isFinite(leastY)) l.h = leastY - l.y
        }
      }

      if (!hasCollisions) {
        // Set new width and height.
        l.w = w
        l.h = h
      }

      if (eventName === 'resizestart' || eventName === 'resizemove') {
        this.placeholder.i = id
        this.placeholder.x = x
        this.placeholder.y = y
        this.placeholder.w = l.w
        this.placeholder.h = l.h
        this.$nextTick(() => {
          this.isDragging = true
        })
        //this.$broadcast("updateWidth", this.width);
        this.eventBus.emit('update-width', this.width)

      } else {
        this.$nextTick(() => {
          this.isDragging = false
        })
      }

      if (this.responsive) this.responsiveGridLayout()

      compact(this.layout, this.verticalCompact)
      this.eventBus.emit('compact')
      this.updateHeight()

      if (eventName === 'resizeend') this.$emit('layout-updated', this.layout)
    },
    responsiveGridLayout (): void {
      const newBreakpoint = getBreakpointFromWidth(this.breakpoints, this.width)
      const newCols = getColsFromBreakpoint(newBreakpoint, this.cols)

      // save actual layout in layouts
      if (this.lastBreakpoint && !this.layouts[this.lastBreakpoint]) {
        this.layouts[this.lastBreakpoint] = cloneLayout(this.layout)
      }

      // Find or generate a new layout.
      const layout = findOrGenerateResponsiveLayout(
        this.originalLayout,
        this.layouts,
        this.breakpoints,
        newBreakpoint,
        this.lastBreakpoint,
        newCols,
        this.verticalCompact
      )

      // Store the new layout.
      this.layouts[newBreakpoint] = layout

      if (this.lastBreakpoint !== newBreakpoint) {
        this.$emit('breakpoint-changed', newBreakpoint, layout)
      }

      // new prop sync
      this.$emit('update:layout', layout)
      this.lastBreakpoint = newBreakpoint
      this.eventBus.emit('set-col-num', getColsFromBreakpoint(newBreakpoint, this.cols))
    },
    updateHeight (): void {
      this.mergedStyle = {
        height: this.containerHeight()
      }
    }
  }
})
</script>

<style>
    .vue-grid-layout {
        position: relative;
        transition: height 200ms ease;
    }
</style>
