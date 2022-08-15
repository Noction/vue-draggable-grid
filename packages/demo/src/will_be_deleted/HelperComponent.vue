<template>
  <div>{{ name }}</div>
</template>

<script>
export default {
  name: 'HelperComponent',
  props: {
    name: {
      type: String,
      default: ''
    }
  }
}
</script>

<style scoped>

</style>
