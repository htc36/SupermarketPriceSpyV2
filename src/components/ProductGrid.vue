<template>
  <div class="columns is-mobile is-multiline is-centered" style="padding-top: 30px; min-height: 800px">
    <b-loading :is-full-page="false" v-model="isLoading" :can-cancel="false"></b-loading>
    <div class="column is-narrow" style="width: 200px; height: 300px" v-for="item in this.products" :key="item.code">
      <product-card :product="item" class="cardSettings"></product-card>
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
            products: [],
            date: "2020-09-28",
            limit: "30",
            offset: "0",
            bottom: false,
            isLoading: true
        }
    },
    methods: {
        getData() {
            this.isLoading = true
            this.offset = this.products.length
            axios.get(this.endPointURL)
                .then(response => {
                    // this.products = this.products.concat(response.data.rows)
                    for (let item of response.data.rows){
                      console.log(item)

                       let product = {}
                      if(this.location == "Pak-n-Save"){
                        product.displayName = item.name
                        product.amount = item.quantityType
                        product.id = item.productId
                        product.image = this.imageName(item.productId)
                        product.price = item.price
                      }else {
                        product.displayName = this.displayName(item.name, item.brand)
                        product.amount = item.volSize
                        product.id = item.code
                        product.image = this.imageName(item.image)
                        product.price = item.salePrice
                      }
                      this.products.push(product)
                    }
                    this.isLoading = false
                })
                .catch(e => {
                    this.errors.push(e)
                })
        },
      imageName: function (image) {
        if (this.location == "Pak-n-Save") {
          const img = image.split("-")[0]
          return "https://a.fsimg.co.nz/product/retail/fan/image/400x400/" + img + ".png"

        }else {
          return "https://static.countdown.co.nz/assets/product-images/big/" + image
        }
      },
      displayName: function (inputName, inputBrand) {
        const brand = inputBrand.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
        const name = inputName.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
        return brand + " " + name
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
            let base = "http://45.76.124.20:8080/api/"
            if (this.location == null || this.location == "Countdown") {
                base += "countdown/getProducts?"
            }else {
                base += "paknsave/getProducts?"
            }
            const searchQuery = this.$route.query.search != null ? this.$route.query.search : ""
            return base + "limit=" + this.limit + "&dateOfSpecials=" + this.date + "&offset=" + this.offset + "&search=" + searchQuery;
        },
        location: function () {
          return this.$route.query.location
        },
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
  .cardSettings {
    min-height: 100%;
  }

</style>