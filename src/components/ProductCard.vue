<template>
    <div class="card"
            :loading="loading"
            max-width="250"
    >

        <div align="center" class="card-image" style="padding-top: 3px">
            <b-image
                    :src="imageName"
                    style="width: 150px; height: 150px"
            ></b-image>
        </div>

<!--        <v-card-title style="padding-bottom: 5px; font-size:0.8em; line-height: 1.1em" >{{displayName}}</v-card-title>-->
        <p style="padding: 15px; font-size:0.8em; text-overflow: ellipsis;white-space: nowrap; overflow: hidden;" @click="viewDetail">{{displayName}}</p>

        <p style="padding-top: 0px">
            {{product.volSize}}
        </p>

        <p style="padding-top: 0px;"> ${{product.salePrice}}</p>


    </div>
</template>

<script>
    export default {
        name: "ListItems",
        props: ["product"],
        computed: {
          displayName: function () {
            const brand = this.product.brand.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
            const name = this.product.name.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
            return brand + " " + name
          },
          imageName: function () {
           return "https://static.countdown.co.nz/assets/product-images/big/" + this.product.image
          }
        },
        methods: {
            viewDetail() {
                const id = this.product.code
                this.$router.push('/product/' + id)
            }
        }
    }
</script>

<style scoped>

</style>