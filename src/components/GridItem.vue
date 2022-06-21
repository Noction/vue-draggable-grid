<template>
  <div
    ref="item"
    class="vue-grid-item"
    :class="classObj"
    :style="style"
  >
    <slot />
    <span
      v-if="resizableAndNotStatic"
      :class="resizableHandleClass"
    />
    <!-- <span v-if="draggable" ref="dragHandle" class="vue-draggable-handle"></span> -->
  </div>
</template>

<script>
import '@interactjs/auto-start'
import '@interactjs/actions/drag'
import '@interactjs/actions/resize'
import '@interactjs/modifiers'
import '@interactjs/dev-tools'

import { defineComponent } from 'vue'
import { getColsFromBreakpoint } from '@/helpers/responsiveUtils'
import { getDocumentDir } from '@/helpers/DOM'
import interact from '@interactjs/interact'
import { createCoreData, getControlPosition } from '@/helpers/draggableUtils'
import { setTopLeft, setTopRight, setTransform, setTransformRtl } from '@/helpers/utils'

export default defineComponent({
  name: 'GridItem',
  inject: ['layout'],
  props: {
    dragAllowFrom: {
      type: String,
      required: false,
      default: null
    },
    dragIgnoreFrom: {
      type: String,
      required: false,
      default: 'a, button'
    },
    h: {
      type: Number,
      required: true
    },
    i: {
      required: true
    },
    isDraggable: {
      type: Boolean,
      required: false,
      default: null
    },
    isResizable: {
      type: Boolean,
      required: false,
      default: null
    },
    maxH: {
      type: Number,
      required: false,
      default: Infinity
    },
    maxW: {
      type: Number,
      required: false,
      default: Infinity
    },
    minH: {
      type: Number,
      required: false,
      default: 1
    },
    minW: {
      type: Number,
      required: false,
      default: 1
    },
    preserveAspectRatio: {
      type: Boolean,
      required: false,
      default: false
    },
    resizeIgnoreFrom: {
      type: String,
      required: false,
      default: 'a, button'
    },
    static: {
      type: Boolean,
      required: false,
      default: false
    },
    w: {
      type: Number,
      required: true
    },
    x: {
      type: Number,
      required: true
    },
    y: {
      type: Number,
      required: true
    }
  },
  emits: ['container-resized', 'resize', 'resized', 'move', 'moved'],
  data () {
    return {
      cols: 1,
      containerWidth: 100,
      dragEventSet: false,
      draggable: null,
      dragging: null,
      innerH: this.h,
      innerW: this.w,
      innerX: this.x,
      innerY: this.y,
      isDragging: false,
      isResizing: false,
      lastH: NaN,
      lastW: NaN,
      lastX: NaN,
      lastY: NaN,
      margin: [10, 10],
      maxRows: Infinity,
      previousH: null,
      previousW: null,
      previousX: null,
      previousY: null,
      resizable: null,
      resizeEventSet: false,
      resizing: null,
      rowHeight: 30,
      rtl: false,
      style: {},
      useCssTransforms: true,
      useStyleCursor: true
    }
  },
  computed: {
    classObj () {
      return {
        cssTransforms : this.useCssTransforms,
        'disable-userselect': this.isDragging,
        'no-touch': this.isAndroid && this.draggableOrResizableAndNotStatic,
        'render-rtl' : this.renderRtl,
        resizing : this.isResizing,
        static: this.static,
        'vue-draggable-dragging' : this.isDragging,
        'vue-resizable' : this.resizableAndNotStatic
      }
    },
    draggableOrResizableAndNotStatic () {
      return (this.draggable || this.resizable) && !this.static
    },
    isAndroid () {
      return navigator.userAgent.toLowerCase().indexOf('android') !== -1
    },
    renderRtl () {
      return (this.layout.isMirrored) ? !this.rtl : this.rtl
    },
    resizableAndNotStatic () {
      return this.resizable && !this.static
    },
    resizableHandleClass () {
      if (this.renderRtl) {
        return 'vue-resizable-handle vue-rtl-resizable-handle'
      } else {
        return 'vue-resizable-handle'
      }
    }
  },
  watch: {
    '$parent.margin' (margin) {
      if (!margin || (margin[0] === this.margin[0] && margin[1] === this.margin[1])) {
        return
      }
      this.margin = margin.map(m => Number(m))
      this.createStyle()
      this.emitContainerResized()
    },
    cols () {
      this.tryMakeResizable()
      this.createStyle()
      this.emitContainerResized()
    },
    containerWidth () {
      this.tryMakeResizable()
      this.createStyle()
      this.emitContainerResized()
    },
    draggable () {
      this.tryMakeDraggable()
    },
    h (newVal) {
      this.innerH = newVal
      this.createStyle()
      // this.emitContainerResized();
    },
    isDraggable () {
      this.draggable = this.isDraggable
    },
    isResizable () {
      this.resizable = this.isResizable
    },
    maxH () {
      this.tryMakeResizable()
    },
    maxW () {
      this.tryMakeResizable()
    },
    minH () {
      this.tryMakeResizable()
    },
    minW () {
      this.tryMakeResizable()
    },
    renderRtl () {
      // console.log("### renderRtl");
      this.tryMakeResizable()
      this.createStyle()
    },
    resizable () {
      this.tryMakeResizable()
    },
    rowHeight () {
      this.createStyle()
      this.emitContainerResized()
    },
    static () {
      this.tryMakeDraggable()
      this.tryMakeResizable()
    },
    w (newVal) {
      this.innerW = newVal
      this.createStyle()
      // this.emitContainerResized();
    },
    x (newVal) {
      this.innerX = newVal
      this.createStyle()
    },
    y (newVal) {
      this.innerY = newVal
      this.createStyle()
    }
  },
  created () {
    // Accessible refernces of functions for removing in beforeDestroy
    const updateWidthHandler = width => {
      this.updateWidth(width)
    }

    const compactHandler = layout => {
      this.compact(layout)
    }

    const setDraggableHandler = isDraggable => {
      if (this.isDraggable === null) {
        this.draggable = isDraggable
      }
    }

    const setResizableHandler = isResizable => {
      if (this.isResizable === null) {
        this.resizable = isResizable
      }
    }

    const setRowHeightHandler = rowHeight => {
      this.rowHeight = rowHeight
    }

    const setMaxRowsHandler = maxRows => {
      this.maxRows = maxRows
    }

    const directionchangeHandler = () => {
      this.rtl = getDocumentDir() === 'rtl'
      this.compact()
    }

    const setColNum = colNum => {
      this.cols = parseInt(colNum)
    }

    this.eventBus.on('update-width', updateWidthHandler)
    this.eventBus.on('compact', compactHandler)
    this.eventBus.on('set-draggable', setDraggableHandler)
    this.eventBus.on('set-resizable', setResizableHandler)
    this.eventBus.on('set-rowHeight', setRowHeightHandler)
    this.eventBus.on('set-max-rows', setMaxRowsHandler)
    this.eventBus.on('directionchange', directionchangeHandler)
    this.eventBus.on('set-col-num', setColNum)

    this.rtl = getDocumentDir() === 'rtl'
  },
  beforeUnmount () {
    //Remove listeners

    this.eventBus.off('update-width', this.updateWidthHandler)
    this.eventBus.off('compact', this.compactHandler)
    this.eventBus.off('set-draggable', this.setDraggableHandler)
    this.eventBus.off('set-resizable', this.setResizableHandler)
    this.eventBus.off('set-row-height', this.setRowHeightHandler)
    this.eventBus.off('set-max-rows', this.setMaxRowsHandler)
    this.eventBus.off('directionchange', this.directionchangeHandler)
    this.eventBus.off('set-col-num', this.setColNum)

    if (this.interactObj) {
      this.interactObj.unset() // destroy interact intance
    }
  },
  mounted () {
    if (this.layout.responsive && this.layout.lastBreakpoint) {
      this.cols = getColsFromBreakpoint(this.layout.lastBreakpoint, this.layout.cols)
    } else {
      this.cols = this.layout.colNum
    }
    this.rowHeight = this.layout.rowHeight
    this.containerWidth = this.layout.width !== null ? this.layout.width : 100
    this.margin = this.layout.margin !== undefined ? this.layout.margin : [10, 10]
    this.maxRows = this.layout.maxRows

    if (this.isDraggable === null) {
      this.draggable = this.layout.isDraggable
    } else {
      this.draggable = this.isDraggable
    }
    if (this.isResizable === null) {
      this.resizable = this.layout.isResizable
    } else {
      this.resizable = this.isResizable
    }
    this.useCssTransforms = this.layout.useCssTransforms
    this.useStyleCursor = this.layout.useStyleCursor
    this.createStyle()
  },
  methods: {
    autoSize () {
      // ok here we want to calculate if a resize is needed
      this.previousW = this.innerW
      this.previousH = this.innerH

      // eslint-disable-next-line vue/require-slots-as-functions
      const newSize=this.$slots.default[0].elm.getBoundingClientRect()
      const pos = this.calcWH(newSize.height, newSize.width)

      if (pos.w < this.minW) {
        pos.w = this.minW
      }
      if (pos.w > this.maxW) {
        pos.w = this.maxW
      }
      if (pos.h < this.minH) {
        pos.h = this.minH
      }
      if (pos.h > this.maxH) {
        pos.h = this.maxH
      }

      if (pos.h < 1) {
        pos.h = 1
      }
      if (pos.w < 1) {
        pos.w = 1
      }

      // this.lastW = x; // basically, this is copied from resizehandler, but shouldn't be needed
      // this.lastH = y;

      if (this.innerW !== pos.w || this.innerH !== pos.h) {
        this.$emit('resize', this.i, pos.h, pos.w, newSize.height, newSize.width)
      }
      if (this.previousW !== pos.w || this.previousH !== pos.h) {
        this.$emit('resized', this.i, pos.h, pos.w, newSize.height, newSize.width)
        this.eventBus.emit('resize-event', ['resizeend', this.i, this.innerX, this.innerY, pos.h, pos.w])
      }
    },
    calcColWidth () {
      const colWidth = (this.containerWidth - (this.margin[0] * (this.cols + 1))) / this.cols
      // console.log("### COLS=" + this.cols + " COL WIDTH=" + colWidth + " MARGIN " + this.margin[0]);

      return colWidth
    },
    calcPosition (x, y, w, h) {
      const colWidth = this.calcColWidth()
      // add rtl support
      let out

      if (this.renderRtl) {
        out = {
          height: h === Infinity ? h : Math.round(this.rowHeight * h + Math.max(0, h - 1) * this.margin[1]),
          right: Math.round(colWidth * x + (x + 1) * this.margin[0]),
          top: Math.round(this.rowHeight * y + (y + 1) * this.margin[1]),
          width: w === Infinity ? w : Math.round(colWidth * w + Math.max(0, w - 1) * this.margin[0])
        }
      } else {
        out = {
          height: h === Infinity ? h : Math.round(this.rowHeight * h + Math.max(0, h - 1) * this.margin[1]),
          left: Math.round(colWidth * x + (x + 1) * this.margin[0]),
          top: Math.round(this.rowHeight * y + (y + 1) * this.margin[1]),
          width: w === Infinity ? w : Math.round(colWidth * w + Math.max(0, w - 1) * this.margin[0])
        }
      }

      return out
    },
    calcWH (height, width) {
      const colWidth = this.calcColWidth()

      // width = colWidth * w - (margin * (w - 1))
      // ...
      // w = (width + margin) / (colWidth + margin)
      let w = Math.round((width + this.margin[0]) / (colWidth + this.margin[0]))
      let h = Math.round((height + this.margin[1]) / (this.rowHeight + this.margin[1]))

      // Capping
      w = Math.max(Math.min(w, this.cols - this.innerX), 0)
      h = Math.max(Math.min(h, this.maxRows - this.innerY), 0)
      return { h, w }
    },
    calcXY (top, left) {
      const colWidth = this.calcColWidth()

      // left = colWidth * x + margin * (x + 1)
      // l = cx + m(x+1)
      // l = cx + mx + m
      // l - m = cx + mx
      // l - m = x(c + m)
      // (l - m) / (c + m) = x
      // x = (left - margin) / (coldWidth + margin)
      let x = Math.round((left - this.margin[0]) / (colWidth + this.margin[0]))
      let y = Math.round((top - this.margin[1]) / (this.rowHeight + this.margin[1]))

      // Capping
      x = Math.max(Math.min(x, this.cols - this.innerW), 0)
      y = Math.max(Math.min(y, this.maxRows - this.innerH), 0)

      return { x, y }
    },
    compact () {
      this.createStyle()
    },
    createStyle () {
      if (this.x + this.w > this.cols) {
        this.innerX = 0
        this.innerW = (this.w > this.cols) ? this.cols : this.w
      } else {
        this.innerX = this.x
        this.innerW = this.w
      }
      const pos = this.calcPosition(this.innerX, this.innerY, this.innerW, this.innerH)

      if (this.isDragging) {
        pos.top = this.dragging.top
        //                    Add rtl support
        if (this.renderRtl) {
          pos.right = this.dragging.left
        } else {
          pos.left = this.dragging.left
        }
      }
      if (this.isResizing) {
        pos.width = this.resizing.width
        pos.height = this.resizing.height
      }

      let style
      // CSS Transforms support (default)

      if (this.useCssTransforms) {
        //                    Add rtl support
        if (this.renderRtl) {
          style = setTransformRtl(pos.top, pos.right, pos.width, pos.height)
        } else {
          style = setTransform(pos.top, pos.left, pos.width, pos.height)
        }

      } else { // top,left (slow)
        //                    Add rtl support
        if (this.renderRtl) {
          style = setTopRight(pos.top, pos.right, pos.width, pos.height)
        } else {
          style = setTopLeft(pos.top, pos.left, pos.width, pos.height)
        }
      }
      this.style = style
    },
    emitContainerResized () {
      // this.style has width and height with trailing 'px'. The
      // resized event is without them
      const styleProps = {}

      for (const prop of ['width', 'height']) {
        const val = this.style[prop]
        const matches = val.match(/^(\d+)px$/)

        if (!matches) return

        // eslint-disable-next-line prefer-destructuring
        styleProps[prop] = matches[1]
      }
      this.$emit('container-resized', this.i, this.h, this.w, styleProps.height, styleProps.width)
    },
    handleDrag (event) {
      if (this.static) return
      if (this.isResizing) return

      const position = getControlPosition(event)

      // Get the current drag point from the event. This is used as the offset.
      if (position === null) return // not possible but satisfies flow
      const { x, y } = position

      // let shouldUpdate = false;
      const newPosition = { left: 0, top: 0 }

      switch (event.type) {
        case 'dragstart': {
          this.previousX = this.innerX
          this.previousY = this.innerY

          const parentRect = event.target.offsetParent.getBoundingClientRect()
          const clientRect = event.target.getBoundingClientRect()

          if (this.renderRtl) {
            newPosition.left = (clientRect.right - parentRect.right) * -1
          } else {
            newPosition.left = clientRect.left - parentRect.left
          }
          newPosition.top = clientRect.top - parentRect.top
          this.dragging = newPosition
          this.isDragging = true
          break
        }
        case 'dragend': {
          if (!this.isDragging) return
          const parentRect = event.target.offsetParent.getBoundingClientRect()
          const clientRect = event.target.getBoundingClientRect()
          //                        Add rtl support

          if (this.renderRtl) {
            newPosition.left = (clientRect.right - parentRect.right) * -1
          } else {
            newPosition.left = clientRect.left - parentRect.left
          }
          newPosition.top = clientRect.top - parentRect.top
          //                        console.log("### drag end => " + JSON.stringify(newPosition));
          //                        console.log("### DROP: " + JSON.stringify(newPosition));
          this.dragging = null
          this.isDragging = false
          // shouldUpdate = true;
          break
        }
        case 'dragmove': {
          const coreEvent = createCoreData(this.lastX, this.lastY, x, y)
          //                        Add rtl support

          if (this.renderRtl) {
            newPosition.left = this.dragging.left - coreEvent.deltaX
          } else {
            newPosition.left = this.dragging.left + coreEvent.deltaX
          }
          newPosition.top = this.dragging.top + coreEvent.deltaY
          //                        console.log("### drag => " + event.type + ", x=" + x + ", y=" + y);
          //                        console.log("### drag => " + event.type + ", deltaX=" + coreEvent.deltaX + ", deltaY=" + coreEvent.deltaY);
          //                        console.log("### drag end => " + JSON.stringify(newPosition));
          this.dragging = newPosition
          break
        }
      }

      // Get new XY
      let pos

      if (this.renderRtl) {
        pos = this.calcXY(newPosition.top, newPosition.left)
      } else {
        pos = this.calcXY(newPosition.top, newPosition.left)
      }

      this.lastX = x
      this.lastY = y

      if (this.innerX !== pos.x || this.innerY !== pos.y) {
        this.$emit('move', this.i, pos.x, pos.y)
      }
      if (event.type === 'dragend' && (this.previousX !== this.innerX || this.previousY !== this.innerY)) {
        this.$emit('moved', this.i, pos.x, pos.y)
      }

      this.eventBus.emit('drag-event', [event.type, this.i, pos.x, pos.y, this.innerH, this.innerW])
    },
    handleResize (event) {
      if (this.static) return
      const position = getControlPosition(event)
      // Get the current drag point from the event. This is used as the offset.

      if (position === null) return // not possible but satisfies flow
      const { x, y } = position

      const newSize = { height: 0, width: 0 }
      let pos

      switch (event.type) {
        case 'resizestart': {
          this.previousW = this.innerW
          this.previousH = this.innerH
          pos = this.calcPosition(this.innerX, this.innerY, this.innerW, this.innerH)
          newSize.width = pos.width
          newSize.height = pos.height
          this.resizing = newSize
          this.isResizing = true
          break
        }
        case 'resizemove': {
          //                        console.log("### resize => " + event.type + ", lastW=" + this.lastW + ", lastH=" + this.lastH);
          const coreEvent = createCoreData(this.lastW, this.lastH, x, y)

          if (this.renderRtl) {
            newSize.width = this.resizing.width - coreEvent.deltaX
          } else {
            newSize.width = this.resizing.width + coreEvent.deltaX
          }
          newSize.height = this.resizing.height + coreEvent.deltaY

          ///console.log("### resize => " + event.type + ", deltaX=" + coreEvent.deltaX + ", deltaY=" + coreEvent.deltaY);
          this.resizing = newSize
          break
        }
        case 'resizeend': {
          //console.log("### resize end => x=" +this.innerX + " y=" + this.innerY + " w=" + this.innerW + " h=" + this.innerH);
          pos = this.calcPosition(this.innerX, this.innerY, this.innerW, this.innerH)
          newSize.width = pos.width
          newSize.height = pos.height
          //                        console.log("### resize end => " + JSON.stringify(newSize));
          this.resizing = null
          this.isResizing = false
          break
        }
      }

      // Get new WH
      pos = this.calcWH(newSize.height, newSize.width)
      if (pos.w < this.minW) {
        pos.w = this.minW
      }
      if (pos.w > this.maxW) {
        pos.w = this.maxW
      }
      if (pos.h < this.minH) {
        pos.h = this.minH
      }
      if (pos.h > this.maxH) {
        pos.h = this.maxH
      }

      if (pos.h < 1) {
        pos.h = 1
      }
      if (pos.w < 1) {
        pos.w = 1
      }

      this.lastW = x
      this.lastH = y

      if (this.innerW !== pos.w || this.innerH !== pos.h) {
        this.$emit('resize', this.i, pos.h, pos.w, newSize.height, newSize.width)
      }
      if (event.type === 'resizeend' && (this.previousW !== this.innerW || this.previousH !== this.innerH)) {
        this.$emit('resized', this.i, pos.h, pos.w, newSize.height, newSize.width)
      }

      this.eventBus.emit('resize-event', [event.type, this.i, this.innerX, this.innerY, pos.h, pos.w])
    },
    tryMakeDraggable () {
      if (this.interactObj === null || this.interactObj === undefined) {
        this.interactObj = interact(this.$refs.item)
        if (!this.useStyleCursor) {
          this.interactObj.styleCursor(false)
        }
      }
      if (this.draggable && !this.static) {
        const opts = {
          allowFrom: this.dragAllowFrom,
          ignoreFrom: this.dragIgnoreFrom
        }

        this.interactObj.draggable(opts)
        /*this.interactObj.draggable({allowFrom: '.vue-draggable-handle'});*/
        if (!this.dragEventSet) {
          this.dragEventSet = true
          this.interactObj.on('dragstart dragmove dragend', event => {
            this.handleDrag(event)
          })
        }
      } else {
        this.interactObj.draggable({
          enabled: false
        })
      }
    },
    tryMakeResizable () {
      if (this.interactObj === null || this.interactObj === undefined) {
        this.interactObj = interact(this.$refs.item)
        if (!this.useStyleCursor) {
          this.interactObj.styleCursor(false)
        }
      }
      if (this.resizable && !this.static) {
        const maximum = this.calcPosition(0, 0, this.maxW, this.maxH)
        const minimum = this.calcPosition(0, 0, this.minW, this.minH)

        // console.log("### MAX " + JSON.stringify(maximum));
        // console.log("### MIN " + JSON.stringify(minimum));

        const opts = {
          // allowFrom: "." + this.resizableHandleClass.trim().replace(" ", "."),
          edges: {
            bottom: `.${  this.resizableHandleClass.trim().replace(' ', '.')}`,
            left: false,
            right: `.${  this.resizableHandleClass.trim().replace(' ', '.')}`,
            top: false
          },
          ignoreFrom: this.resizeIgnoreFrom,
          restrictSize: {
            max: {
              height: maximum.height,
              width: maximum.width
            },
            min: {
              height: minimum.height,
              width: minimum.width
            }
          }
        }

        if (this.preserveAspectRatio) {
          opts.modifiers = [
            interact.modifiers.aspectRatio({
              ratio: 'preserve'
            })
          ]
        }

        this.interactObj.resizable(opts)
        if (!this.resizeEventSet) {
          this.resizeEventSet = true
          this.interactObj
            .on('resizestart resizemove resizeend', event => {
              this.handleResize(event)
            })
        }
      } else {
        this.interactObj.resizable({
          enabled: false
        })
      }
    },
    updateWidth (width, colNum) {
      this.containerWidth = width
      if (colNum !== undefined && colNum !== null) {
        this.cols = colNum
      }
    }
  }
})
</script>

<style>
    .vue-grid-item {
        touch-action: none;
        box-sizing: border-box;
        transition: all 200ms ease;
        transition-property: left, top, right;
        background-color: #f2f2f2;
        /* add right for rtl */
    }

    .vue-grid-item.no-touch {
        -ms-touch-action: none;
        touch-action: none;
    }

    .vue-grid-item.cssTransforms {
        transition-property: transform;
        left: 0;
        right: auto;
    }

    .vue-grid-item.cssTransforms.render-rtl {
        left: auto;
        right: 0;
    }

    .vue-grid-item.resizing {
        opacity: 0.6;
        z-index: 3;
    }

    .vue-grid-item.vue-draggable-dragging {
        transition:none;
        z-index: 3;
    }

    .vue-grid-item.vue-grid-placeholder {
        background: red;
        opacity: 0.2;
        transition-duration: 100ms;
        z-index: 2;
        -webkit-user-select: none;
        -moz-user-select: none;
        -ms-user-select: none;
        -o-user-select: none;
        user-select: none;
    }

    .vue-grid-item > .vue-resizable-handle {
        position: absolute;
        width: 20px;
        height: 20px;
        bottom: 0;
        right: 0;
        background: url('data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBzdGFuZGFsb25lPSJubyI/Pg08IS0tIEdlbmVyYXRvcjogQWRvYmUgRmlyZXdvcmtzIENTNiwgRXhwb3J0IFNWRyBFeHRlbnNpb24gYnkgQWFyb24gQmVhbGwgKGh0dHA6Ly9maXJld29ya3MuYWJlYWxsLmNvbSkgLiBWZXJzaW9uOiAwLjYuMSAgLS0+DTwhRE9DVFlQRSBzdmcgUFVCTElDICItLy9XM0MvL0RURCBTVkcgMS4xLy9FTiIgImh0dHA6Ly93d3cudzMub3JnL0dyYXBoaWNzL1NWRy8xLjEvRFREL3N2ZzExLmR0ZCI+DTxzdmcgaWQ9IlVudGl0bGVkLVBhZ2UlMjAxIiB2aWV3Qm94PSIwIDAgNiA2IiBzdHlsZT0iYmFja2dyb3VuZC1jb2xvcjojZmZmZmZmMDAiIHZlcnNpb249IjEuMSINCXhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiIHhtbDpzcGFjZT0icHJlc2VydmUiDQl4PSIwcHgiIHk9IjBweCIgd2lkdGg9IjZweCIgaGVpZ2h0PSI2cHgiDT4NCTxnIG9wYWNpdHk9IjAuMzAyIj4NCQk8cGF0aCBkPSJNIDYgNiBMIDAgNiBMIDAgNC4yIEwgNCA0LjIgTCA0LjIgNC4yIEwgNC4yIDAgTCA2IDAgTCA2IDYgTCA2IDYgWiIgZmlsbD0iIzAwMDAwMCIvPg0JPC9nPg08L3N2Zz4=');
        background-position: bottom right;
        padding: 0 3px 3px 0;
        background-repeat: no-repeat;
        background-origin: content-box;
        box-sizing: border-box;
        cursor: se-resize;
    }

    .vue-grid-item > .vue-rtl-resizable-handle {
        bottom: 0;
        left: 0;
        background: url(data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAuMDAwMDAwMDAwMDAwMDAyIiBoZWlnaHQ9IjEwLjAwMDAwMDAwMDAwMDAwMiIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KIDwhLS0gQ3JlYXRlZCB3aXRoIE1ldGhvZCBEcmF3IC0gaHR0cDovL2dpdGh1Yi5jb20vZHVvcGl4ZWwvTWV0aG9kLURyYXcvIC0tPgogPGc+CiAgPHRpdGxlPmJhY2tncm91bmQ8L3RpdGxlPgogIDxyZWN0IGZpbGw9Im5vbmUiIGlkPSJjYW52YXNfYmFja2dyb3VuZCIgaGVpZ2h0PSIxMiIgd2lkdGg9IjEyIiB5PSItMSIgeD0iLTEiLz4KICA8ZyBkaXNwbGF5PSJub25lIiBvdmVyZmxvdz0idmlzaWJsZSIgeT0iMCIgeD0iMCIgaGVpZ2h0PSIxMDAlIiB3aWR0aD0iMTAwJSIgaWQ9ImNhbnZhc0dyaWQiPgogICA8cmVjdCBmaWxsPSJ1cmwoI2dyaWRwYXR0ZXJuKSIgc3Ryb2tlLXdpZHRoPSIwIiB5PSIwIiB4PSIwIiBoZWlnaHQ9IjEwMCUiIHdpZHRoPSIxMDAlIi8+CiAgPC9nPgogPC9nPgogPGc+CiAgPHRpdGxlPkxheWVyIDE8L3RpdGxlPgogIDxsaW5lIGNhbnZhcz0iI2ZmZmZmZiIgY2FudmFzLW9wYWNpdHk9IjEiIHN0cm9rZS1saW5lY2FwPSJ1bmRlZmluZWQiIHN0cm9rZS1saW5lam9pbj0idW5kZWZpbmVkIiBpZD0ic3ZnXzEiIHkyPSItNzAuMTc4NDA3IiB4Mj0iMTI0LjQ2NDE3NSIgeTE9Ii0zOC4zOTI3MzciIHgxPSIxNDQuODIxMjg5IiBzdHJva2Utd2lkdGg9IjEuNSIgc3Ryb2tlPSIjMDAwIiBmaWxsPSJub25lIi8+CiAgPGxpbmUgc3Ryb2tlPSIjNjY2NjY2IiBzdHJva2UtbGluZWNhcD0idW5kZWZpbmVkIiBzdHJva2UtbGluZWpvaW49InVuZGVmaW5lZCIgaWQ9InN2Z181IiB5Mj0iOS4xMDY5NTciIHgyPSIwLjk0NzI0NyIgeTE9Ii0wLjAxODEyOCIgeDE9IjAuOTQ3MjQ3IiBzdHJva2Utd2lkdGg9IjIiIGZpbGw9Im5vbmUiLz4KICA8bGluZSBzdHJva2UtbGluZWNhcD0idW5kZWZpbmVkIiBzdHJva2UtbGluZWpvaW49InVuZGVmaW5lZCIgaWQ9InN2Z183IiB5Mj0iOSIgeDI9IjEwLjA3MzUyOSIgeTE9IjkiIHgxPSItMC42NTU2NCIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2U9IiM2NjY2NjYiIGZpbGw9Im5vbmUiLz4KIDwvZz4KPC9zdmc+);
        background-position: bottom left;
        padding-left: 3px;
        background-repeat: no-repeat;
        background-origin: content-box;
        cursor: sw-resize;
        right: auto;
    }

    .vue-grid-item.disable-userselect {
        user-select: none;
    }
</style>
