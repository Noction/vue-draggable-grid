## [1.9.0] - 17.09.2022


### Major changes

- `horizontalShift` Added new prop for gridLayout *(swaps grid items standing next to each other when moving horizontally)*
- `alignGridItems` Added expose function *(autocomplete grid items in free cells)*

```vue

<template>
  <grid-layout
    ref="gridLayout"
  />
</template>
<script>
export default {
  methods: {
    foo () {
      this.$refs.gridLayout.alignGridItems()
    }
  }
}
</script>
```

### Changed features

- Update `license` from `MITT` to `MIT`