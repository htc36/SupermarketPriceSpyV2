<template>
    <div class="card cardSettings"
            :loading="loading"
            max-width="250"
    >

        <div class="test">
        <div align="center" class="card-image" style="padding-top: 3px" @click="viewDetail">
            <b-image
                    :src="imageName"
                    style="width: 150px; height: 150px"
            ></b-image>
        </div>

<!--        <v-card-title style="padding-bottom: 5px; font-size:0.8em; line-height: 1.1em" >{{displayName}}</v-card-title>-->
        <p class="title" @click="viewDetail">{{displayName}}</p>
        </div>
<!--        <p style="padding: 15px; font-size:0.8em; cursor: pointer" @click="viewDetail">{{displayName}}</p>-->

        <p style="padding-left: 15px; font-size: 0.9em" class="subtitle is-6">
<!--        <p style="" class="subtitle is-6">-->
            {{product.volSize}}
        </p>

        <p style="text-align: right; padding-right: 15px; padding-bottom: 15px; font-weight: bolder"> ${{product.salePrice}}</p>


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
    .title {
        padding: 15px 15px 5px;
        font-size:1em;
        text-overflow: ellipsis;
        white-space: nowrap;
        overflow: hidden;
        cursor: pointer;
        z-index: 100;
    }
    .title:hover {
        /*height: 300px;*/
        /*white-space: normal;*/
        /*height: 300px;*/
        /*transition: height 2s;*/
        /*text-overflow: visible;*/
    }
    .test:hover > .title {
        white-space: normal;
        transition: height 2s;
        z-index: -1;
        /*text-overflow: visible;*/
    }
    .cardSettings:hover {
      z-index: 1000;
      transition: height 2s;
      width: 500px
    }

</style>