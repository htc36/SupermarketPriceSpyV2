<template>
  <div class="container is-fluid" style="width: 80%">
  <div align="center" style="padding-top: 3px">
    <h1>hey</h1>
      <b-image
              :src="imageName"
      ></b-image>
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
            imageName: function () {
                  return "https://static.countdown.co.nz/assets/product-images/big/" + this.countdown.image
            }
        }

    }
</script>

<style scoped>

</style>