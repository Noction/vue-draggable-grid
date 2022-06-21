<template>
  <div
    ref="item"
    class="vue-grid-layout"
    :style="mergedStyle"
  >
    <slot />
    <!--    <grid-item -->
    <!--      v-show="isDragging" -->
    <!--      class="vue-grid-placeholder" -->
    <!--      :x="placeholder.x" -->
    <!--      :y="placeholder.y" -->
    <!--      :w="placeholder.w" -->
    <!--      :h="placeholder.h" -->
    <!--      :i="placeholder.i" -->
    <!--    /> -->
  </div>
</template>

<script>
import { defineComponent } from 'vue'
import elementResizeDetectorMaker from 'element-resize-detector'
import { addWindowEventListener, removeWindowEventListener } from '@/helpers/DOM'
import { bottom, cloneLayout, compact, getAllCollisions, getLayoutItem, moveElement, validateLayout } from '@/helpers/utils'
import { findOrGenerateResponsiveLayout, getBreakpointFromWidth, getColsFromBreakpoint } from '@/helpers/responsiveUtils'

export default defineComponent({
  name: 'GridLayout',
  components: {
    // GridItem
  },
  provide () {
    return {
      layout: this
    }
  },
  props: {
    // If true, the container height swells and contracts to fit contents
    autoSize: {
      type: Boolean,
      default: true
    },
    breakpoints:{
      type: Object,
      default () { return { lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 } }
    },
    colNum: {
      type: Number,
      default: 12
    },
    cols:{
      type: Object,
      default () { return { lg: 12, md: 10, sm: 6, xs: 4, xxs: 2 } }
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
      type: Array,
      required: true
    },
    margin: {
      type: Array,
      default () {
        return [10, 10]
      }
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
      type: Object,
      default () {
        return {}
      }
    },
    rowHeight: {
      type: Number,
      default: 150
    },
    useCssTransforms: {
      type: Boolean,
      default: true
    },
    useStyleCursor: {
      type: Boolean,
      default: true
    },
    verticalCompact: {
      type: Boolean,
      default: true
    }
  },
  emits: ['layout-ready', 'update:layout', 'layout-created', 'layout-before-mount', 'layout-mounted', 'layout-updated', 'breakpoint-changed'],
  data () {
    return {
      isDragging: false,
      lastBreakpoint: null, // store last active breakpoint
      lastLayoutLength: 0,
      layouts: {}, // array to store all layouts from different breakpoints
      mergedStyle: {},
      originalLayout: null, // store original Layout
      placeholder: {
        h: 0,
        i: -1,
        w: 0,
        x: 0,
        y: 0
      },
      width: null
    }
  },
  watch: {
    colNum (val) {
      this.eventBus.emit('set-col-num', val)
    },
    isDraggable () {
      this.eventBus.emit('set-draggable', this.isDraggable)
    },
    isResizable () {
      this.eventBus.emit('set-resizable', this.isResizable)
    },
    layout () {
      this.layoutUpdate()
    },
    margin () {
      this.updateHeight()
    },
    maxRows () {
      this.eventBus.emit('set-max-rows', this.maxRows)
    },
    responsive () {
      if (!this.responsive) {
        this.$emit('update:layout', this.originalLayout)
        this.eventBus.emit('set-col-num', this.colNum)
      }
      this.onWindowResize()
    },
    rowHeight () {
      this.eventBus.emit('set-row-height', this.rowHeight)
    },
    width (newval, oldval) {
      this.$nextTick( () => {
        //this.$broadcast("updateWidth", this.width);
        this.eventBus.emit('update-width', this.width)
        if (oldval === null) {
          /*
                            If oldval == null is when the width has never been
                            set before. That only occurs when mouting is
                            finished, and onWindowResize has been called and
                            this.width has been changed the first time after it
                            got set to null in the constructor. It is now time
                            to issue layout-ready events as the GridItems have
                            their sizes configured properly.

                            The reason for emitting the layout-ready events on
                            the next tick is to allow for the newly-emitted
                            updateWidth event (above) to have reached the
                            children GridItem-s and had their effect, so we're
                            sure that they have the final size before we emit
                            layout-ready (for this GridLayout) and
                            item-layout-ready (for the GridItem-s).

                            This way any client event handlers can reliably
                            invistigate stable sizes of GridItem-s.
                        */
          this.$nextTick(() => {
            this.$emit('layout-ready', this.layout)
          })
        }
        this.updateHeight()
      })
    }
  },
  created () {
    // Accessible refernces of functions for removing in beforeDestroy
    const resizeEventHandler = (eventType, i, x, y, h, w) => {
      this.resizeEvent(eventType, i, x, y, h, w)
    }

    this.dragEventHandler = (eventType, i, x, y, h, w) => {
      this.dragEvent(eventType, i, x, y, h, w)
    }
    this.eventBus.on('resize-event', this.resizeEvent)
    this.eventBus.on('drag-event', this.dragEvent)
    this.$emit('layout-created', this.layout)
  },
  beforeUnmount () {
    this.eventBus.off('resize-eevent', this.resizeEvent)
    this.eventBus.off('drag-eevent', this.dragEvent)
    // this.eventBus.$destroy()
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
          this.erd = elementResizeDetectorMaker({
            callOnAdd: false,
            strategy: 'scroll' //<- For ultra performance.
          })
          this.erd.listenTo(this.$refs.item, () => {
            this.onWindowResize()
          })
        })
      })
    })
  },
  methods: {
    containerHeight () {
      if (!this.autoSize) return
      // console.log("bottom: " + bottom(this.layout))
      // console.log("rowHeight + margins: " + (this.rowHeight + this.margin[1]) + this.margin[1])
      const containerHeight =  `${bottom(this.layout) * (this.rowHeight + this.margin[1]) + this.margin[1]  }px`

      return containerHeight
    },
    dragEvent ([eventName, id, x, y, h, w]) {
      //console.log(eventName + " id=" + id + ", x=" + x + ", y=" + y);
      let l = getLayoutItem(this.layout, id)
      //GetLayoutItem sometimes returns null object

      if (l === undefined || l === null) {
        l = { x:0, y:0 }
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
    findDifference (layout, originalLayout) {

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
    initResponsiveFeatures () {
      // clear layouts
      this.layouts = Object.assign({}, this.responsiveLayouts)
    },
    layoutUpdate () {
      if (this.layout !== undefined && this.originalLayout !== null) {
        if (this.layout.length !== this.originalLayout.length) {
          // console.log("### LAYOUT UPDATE!", this.layout.length, this.originalLayout.length);

          const diff = this.findDifference(this.layout, this.originalLayout)

          if (diff.length > 0) {
            // console.log(diff);
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
    onWindowResize () {
      if (this.$refs !== null && this.$refs.item !== null && this.$refs.item !== undefined) {
        this.width = this.$refs.item.offsetWidth
      }
      // this.eventBus.emit('resize-event')
    },

    resizeEvent ([eventName, id, x, y, h, w]) {
      let l = getLayoutItem(this.layout, id)

      if (l === undefined || l === null) {
        l = { h:0, w:0 }
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

      if (this.responsive) this.responsiveGridLayout()

      compact(this.layout, this.verticalCompact)
      this.eventBus.emit('compact')
      this.updateHeight()

      if (eventName === 'resizeend') this.$emit('layout-updated', this.layout)
    },

    responsiveGridLayout () {
      const newBreakpoint = getBreakpointFromWidth(this.breakpoints, this.width)
      const newCols = getColsFromBreakpoint(newBreakpoint, this.cols)

      // save actual layout in layouts
      if (this.lastBreakpoint !== null && !this.layouts[this.lastBreakpoint])
        this.layouts[this.lastBreakpoint] = cloneLayout(this.layout)

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

    updateHeight () {
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
