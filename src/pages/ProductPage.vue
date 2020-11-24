<template>
  <div class="container is-fluid" style="width: 80%; background-color: white; box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);">
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