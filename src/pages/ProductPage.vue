<template>
  <div class="container is-fluid" style="width: 80%">
        <product-grid align-center></product-grid>
  </div>
</template>

<script>
    import ProductGrid from "@/components/ProductGrid";
    export default {
        name: "Home",
        components: {ProductGrid}
    }
</script>

<style scoped>

</style>