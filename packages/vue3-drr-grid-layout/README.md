# vue3-drr-grid-layout
[![npm package](https://img.shields.io/npm/v/vue3-drr-grid-layout.svg?style=flat-square)](https://www.npmjs.com/package/vue3-drr-grid-layout)
[![npm downloads](https://img.shields.io/npm/dt/vue3-drr-grid-layout.svg?maxAge=2592000)]()

Grid layout for vue 3 with draggable, resize, responsive events

Module use source code from [VueGridLayout](https://www.npmjs.com/package/vue-grid-layout)

Rewrote to TypeScript, Composition API and migrated to Vue3


### Usage
```vue
  <template>
    <grid-layout
      v-model:layout="layout"
      :col-num="12"
      :row-height="30"
    >
      <template #item="{ item }">
        {{ item.i }}
      </template>
    </grid-layout>
  </template>
  <script>
    export default {
      name: 'App',
      data () {
        return {
          layout: [
            { x: 0, y: 0, w: 2, h: 2, i: 0 },
            { x: 2, y: 0, w: 2, h: 4, i: 1 },
            { x: 4, y: 0, w: 2, h: 5, i: 2 },
            { x: 6, y: 0, w: 2, h: 3, i: 3 },
            { x: 8, y: 0, w: 2, h: 3, i: 4 },
            { x: 8, y: 0, w: 2, h: 3, i: 5 },
            { x: 0, y: 5, w: 2, h: 5, i: 6 },
            { x: 2, y: 5, w: 2, h: 5, i: 7 },
            { x: 4, y: 5, w: 2, h: 5, i: 8 },
            { x: 6, y: 3, w: 2, h: 4, i: 9 }
          ]
        }
      }
    }
  </script>
```

### Grid Layout Props

```js
//
// Required props
//
// This is grid layout for not responsive pages
layout: {
    x: number
    y: number
    w: number
    h: number
    i: number
    isDraggable?: boolean
    isResizable?: boolean
    maxH?: number
    maxW?: number
    minH?: number
    minW?: number
    moved?: boolean
    static?: boolea
}
// Number of columns
colNum: number

//
// Optional props
//
autoSize: boolean = true
isDraggable: boolean = true
isDraggable: boolean = true
margin: [number, number] = [10, 10]
maxRows: number = Infinity
preventCollision: boolean = true
rowHeight: number = 150
useCssTransforms: boolean = true
verticalCompact: boolean = true
```

### Responsive grid layout props
```js
// To enable responsive mode, the responsive prop must be true.
responsive: boolean = false
// 6 display widths
// Window witch > lg component use layout prop
breakpoints: object = { lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 }
// colNum by display width
cols: object = { lg: 12, md: 10, sm: 6, xs: 4, xxs: 2 }
// Responsive layout is a { [keyof breakpoints]: layout }
// { lg: layout, md: layout, sm: layout, xs: layout, xss: layout }
responsiveLayouts: object = {}
```

### Grid layout emits
- **@container-resized**="({ i, h, w, height, width }) => {}"
    * **When layout container was resized**
```ts
    {
        i: number // grid item index
        h: number // grid item height from propss
        w: number // grid item width from props
        height: number // grid item height
        width: number // grid item width
     }
```
- **@resize**="(i, h, w, newHeight, newWidth) => {}"
    * **Grid item resize event**
```ts
    i: number // grid item index
    h: number // grid item height from propss
    w: number // grid item width from props
    newHeight: number // grid item height
    newWidth: number // grid item width   
```
- **@resized**="(i, h, w, newHeight, newWidth) => {}"
    * **Grid item resizeend event**
```ts
    i: number // grid item index
    h: number // grid item height from propss
    w: number // grid item width from props
    newHeight: number // grid item height
    newWidth: number // grid item width   
```
- **@move**="(i, x, y) => {}"
    * **Grid item drag event**
```ts
    i: number // grid item index
    x: number // grid item x position
    y: number // grid item y position 
```
- **@moved**="(i, x, y) => {}"
    * **Grid item dragend event**
```ts
    i: number // grid item index
    x: number // grid item x position
    y: number // grid item y position 
``` 

