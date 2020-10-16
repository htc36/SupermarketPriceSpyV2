<template>
  <div class="columns is-mobile is-multiline is-centered" style="padding-top: 30px">
    <div class="column is-narrow" style="width: 200px; height: 300px" v-for="item in this.products" :key="item.code">
      <product-card :product="item"></product-card>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import ProductCard from "@/components/ProductCard";
export default {
    name: "ProductGrid",
    components: {ProductCard},
    data() {
        return {
            dummydata: [{
                name: "dry cat food lamb & chicken",
                brand: "chef",
                volSize: "2kg",
                type: "pet",
                barcode: "9300657854584",
                code: "100046",
                image: "9300657854584.jpg",
                salePrice: "14.00"
            }, {
                name: "cat food beef rice & carrot",
                brand: "fancy feast inspirations",
                volSize: "70g",
                type: "pet",
                barcode: "9300605133495",
                code: "100080",
                image: "9300605133495.jpg",
                salePrice: "12.00"
            }],
            products: [],
            date: "2020-09-28",
            limit: "30",
            offset: "0",
            bottom: false
        }
    },
    methods: {
        getData() {
            this.offset = this.products.length
            axios.get(this.endPointURL)
                .then(response => {
                    this.products = this.products.concat(response.data.rows)
                })
                .catch(e => {
                    this.errors.push(e)
                })
        },
        bottomVisible() {
            const scrollY = window.scrollY
            const visible = document.documentElement.clientHeight
            const pageHeight = document.documentElement.scrollHeight
            const bottomOfPage = visible + scrollY >= pageHeight
            return bottomOfPage || pageHeight < visible
        },

    },
    computed: {
        endPointURL: function () {
            const base = "http://45.76.124.20:8080/api/getProducts?"
            const searchQuery = this.$route.query.search != null ? this.$route.query.search : ""
            return base + "limit=" + this.limit + "&dateOfSpecials=" + this.date + "&offset=" + this.offset + "&search=" + searchQuery;
        }
    },
    watch: {
        '$route': function () {
            this.products = []
            this.getData();
        },
        deep: true,
        immediate: true,
        bottom(bottom) {
            if (bottom) {
                this.getData()
            }
        }
    },
    created() {
        window.addEventListener('scroll', () => {
            this.bottom = this.bottomVisible()
        })
        this.getData()
    }
}
</script>

<style scoped>

</style>