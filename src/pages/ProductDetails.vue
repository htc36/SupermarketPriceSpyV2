<template>
  <div class="container is-fluid"  style="width: 80%; padding-top: 40px">
    <div class="tile is-ancestor">
      <div class="tile is-parent">
        <div class="tile is-child box" align="center">
          <b-image v-if="countdown != null"
                   :src="imageName"
                   style="width: 300px; height: 300px"
          ></b-image>
        </div>
        <div class="tile is-5 is-vertical is-parent box">
          <div class="tile is-child box">
            <p class="title">{{displayName}}</p>
            <p >{{countdown.volSize}}</p>
            <p class="title" align="right" >${{countdown.salePrice}}</p>
          </div>
<!--          <div class="tile is-child box">-->
<!--            <p class="title">Two</p>-->
<!--          </div>-->
        </div>
      </div>
    </div>
  </div>


</template>

<script>
    import axios from 'axios';

    export default {
        name: "ProductDetails",
        data() {
            return {
                dates:[],
                countdown:null,
                pakSave:null

            }
        },
        methods : {
            getData() {
                let url = "http://45.76.124.20:8080/api/pakNsave/getSingleLinkedProductHistory?code=" + this.$route.params.id + "&location=Taupo"
                axios.get(url)
                    .then(response => {
                        this.dates = response.data.dates
                        this.countdown = response.data.result.countdown
                        this.pakSave = response.data.result.paknsave
                    })
                    .catch(e => {
                        this.errors.push(e)
                    })
            }
        },
        created() {
            this.getData()
        },
        computed: {
            displayName: function () {
                const brand = this.countdown.brand.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
                const name = this.countdown.name.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
                return brand + " " + name
            },

            imageName: function () {
                  return "https://static.countdown.co.nz/assets/product-images/big/" + this.countdown.image
            }
        }

    }
</script>

<style scoped>
  .bottom {
    position:absolute;
    vertical-align: bottom;
    align-text: bottom;
    alignment: right;
  }

</style>