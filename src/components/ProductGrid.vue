<template>
  <div class="columns is-mobile is-multiline is-centered" style="padding-top: 30px; min-height: 800px">
    <b-loading :is-full-page="false" v-model="isLoading" :can-cancel="false"></b-loading>
    <div class="column is-narrow" style="width: 200px; height: 300px" v-for="item in this.products" :key="item.code">
      <product-card :product="item" class="cardSettings"></product-card>
    </div>
  </div>
</template>

<script>
// import axios from 'axios';
import ProductCard from "@/components/ProductCard";
import api from '@/api'

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
            isLoading: true,
            storeCode : "",
            defaultStore: {
                "countdown": "2449151",
                // "paknsave": "21ecaaed-0749-4492-985e-4bb7ba43d59c"
                "paknsave": "poo"
            },
    }
    },
    methods: {
        getData() {
            this.isLoading = true
            this.offset = this.products.length

            let stores = this.$cookies.isKey('store') ? this.$cookies.get("store") : this.defaultStore
            this.storeCode = stores[this.location]

            api.getAllProducts(this.endPointURL)
                .then(response => {
                    // this.products = this.products.concat(response.data.rows)
                    for (let item of response.data.rows){
                      console.log(item)

                       let product = {}
                      if(this.location == "paknsave"){
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
                    console.log(e)
                })
        },
      imageName: function (image) {
        if (this.location == "paknsave") {
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
            let base = ""
            if (this.location == null || this.location == "countdown") {
                base += "/countdown/getProducts?"
            }else {
                base += "/paknsave/getProducts?"
            }
            const searchQuery = this.$route.query.search != null ? this.$route.query.search : ""
            const store = "&storeCode=" + this.storeCode
            // const store = "&cdStoreCode=" + this.storeCodes['countdown'] + "&psStoreCode =" + this.storeCodes['paknsave']
            return base + "limit=" + this.limit + "&dateOfSpecials=" + this.getDateStartOfWeek + "&offset=" + this.offset + "&search=" + searchQuery + store;
        },
        location: function () {
          return this.$route.query.location
        },
        getDateStartOfWeek: function () {
            let date = new Date();
            var diff = date.getDate() - date.getDay() + (date.getDay() === 0 ? -6 : 1) - 7;
            const mondayDate = new Date(date.setDate(diff)).toLocaleDateString();
            const splitItems = mondayDate.split("/")
            return splitItems[2] + "-" + splitItems[0] + "-" +splitItems[1]
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
  .cardSettings {
    min-height: 100%;
  }

</style>