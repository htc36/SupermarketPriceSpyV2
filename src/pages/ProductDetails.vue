<template>
  <div class="container" style="background-color: white; box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);">
    <b-loading :is-full-page="false" v-model="isLoading" :can-cancel="false"></b-loading>
    <div>
          <div class="tile is-ancestor" style="">
            <div class="tile" style="">
              <b-image v-if="countdown != null" :src="imageName" style="max-height: 400px; max-width: 400px;float: left; padding-bottom: 20px"
                       :placeholder="require('../../loading.gif')"
              ></b-image>
            </div>
            <div class = "tile is-8 is-vertical">
              <h1 class="title tile">{{ displayName }} {{volume}} - ${{price}}</h1>
              <div class="tile">
                <table style="width:100%;">
                  <tr>
                    <td colspan="4">
                      <caption class="subtitle" style="float: left;">Price Comparison</caption>
                    </td>
                  </tr>
                  <tr>
                    <th>Store</th>
                    <th>Product Name</th>
                    <th>Current Price</th>
                  </tr>
                  <tr v-if="countdown.length !== 0">
                  <tr v-for="item in this.countdown" :key="item.name">
                    <td>Countdown</td>
                    <td v-if="isPaknSave"><a :href="'/#/product/' + item.id">{{item.name}}</a></td>
                    <td v-else>{{item.name}}</td>
                    <td>${{ item.price[item.price.length - 1] }}</td>
                  </tr>
                  <tr v-for="item in this.pakSave" :key="item.name">
                    <td>Pak'nSave</td>
                    <td v-if="!isPaknSave"><a :href="'/#/product/' + item.id">{{item.name}}</a></td>
                    <td v-else>{{item.name}}</td>
                    <td>${{ item.price[item.price.length - 1] }}</td>
                  </tr>
                </table>
              </div>
              <div class="tile"></div>
            </div>
          </div>

    </div>

    <br>
    <br>


    <div>
      <Plotly :data="data" :layout="layout" :display-mode-bar="false"></Plotly>
    </div>
    <map-pane ref="storesMap"> </map-pane>
  </div>


</template>

<script>
import {Plotly} from 'vue-plotly'
import api from "@/api";
import MapPane from "@/components/MapPane";

export default {
  name: "ProductDetails",
  components: {
      MapPane,
    Plotly
  },
  data() {
    return {
      dates: [],
      countdown: [],
      pakSave: [],
      data: [],
        isLoading: true,
      layout: {
        // title: "Price History",
        hovermode: "x",
        spikesnap: "cursor",
        // hoverinfo: "all",
        hoverformat: "%H~%M~%S.%2f",
        spikedistance: 100,
        xaxis: {'showspikes': true},
          showlegend: true,
          legend: {"orientation": "h"},
          margin: {
              t: 20, //top margin
              l: 20, //left margin
              r: 25, //right margin
              b: 80 //bottom margin
          }
      },


    }
  },
  methods: {
    getData() {
        this.isLoading = true
        let store
        if(this.isPaknSave) {
            store = "pakNsave"
        } else {
            store = "countdown"
        }
        let storeCodes =this.$cookies.get("store")
        const storeQuery = "&cdStoreCode=" + storeCodes['countdown'] + "&psStoreCode=" + storeCodes['paknsave']
        api.getProductDetails(store, this.$route.params.id, storeQuery)
          .then(response => {
            this.dates = response.data.dates
            this.countdown = response.data.result.countdown
            this.pakSave = response.data.result.paknsave
            this.setPlotPoints()
            this.isLoading = false
            let date = "2021-01-04"
            api.getProductALlStores(this.$route.params.id, date, store)
                .then(response => {
                    this.setMapPoints(response.data)
                })
          })
          .catch(e => {
            this.errors.push(e)
          })

    },
    setPlotPoints() {
        let countdownX = []
        let pakSaveX = []
        this.data = []
        if (this.countdown.length != 0) {
            for (const dateIndex of this.countdown[0].date) {
                const date = this.dates[dateIndex].split("/")
                const month = parseInt(date[1]) - 1
                const dateObj = new Date(date[2], month, date[0])
                countdownX.push(dateObj)
            }
        }
        if (this.pakSave.length != 0) {
            for (const dateIndex of this.pakSave[0].date) {
                const date = this.dates[dateIndex].split("/")
                const month = parseInt(date[1]) - 1
                const dateObj = new Date(date[2], month, date[0])
                pakSaveX.push(dateObj)
            }
        }
        if (countdownX.length != 0) {
            const countdownPoints = {
                x: countdownX,
                y: this.countdown[0].price,
                type: "scatter",
                name: "Countdown"
            }
            this.data.push(countdownPoints)
        }
        if (pakSaveX.length != 0) {
            const pakSavePoints = {
                x: pakSaveX,
                y: this.pakSave[0].price,
                type: "scatter",
                name: "Pak n Save"
            }
            this.data.push(pakSavePoints)
        }
    },
      setMapPoints(data) {
        let id = 0
        for (let store of data) {
            if (store.cdLat != null) {
                this.$refs.storesMap.createMarker(id, 3, store.cdLat, store.cdLng, store.cdPrice, store.cdStoreName, false)
                id++
            }
            if (store.psPrice != null) {
                this.$refs.storesMap.createMarker(id, 1, store.psLat, store.psLng, store.psPrice, store.psStoreName, false)
            }
            id++
        }
        console.log(this.$refs.storesMap.markers)
      }
  },
  mounted() {
    this.getData()
  },
  computed: {
      isPaknSave: function () {
          return this.$route.params.id.split("-").length >= 2
      },
    displayName: function () {
      if (this.isPaknSave){
        return this.pakSave[0].name
      }
      const brand = this.countdown[0].brand.replace(/\w\S*/g, function (txt) {
        return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
      });
      const name = this.countdown[0].name.replace(/\w\S*/g, function (txt) {
        return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
      });
      return brand + " " + name
    },
    price: function () {
        return this.isPaknSave ? this.pakSave[0].price[this.pakSave[0].price.length - 1]: this.countdown[0].salePrice

    },
    volume: function () {
        return this.isPaknSave ? this.pakSave[0].quantityType : this.countdown[0].volSize
    },

    imageName: function () {
        if (this.isPaknSave) {
            const img = this.$route.params.id.split("-")[0]
            return "https://a.fsimg.co.nz/product/retail/fan/image/400x400/" + img + ".png"
        }
      return "https://static.countdown.co.nz/assets/product-images/zoom/" + this.countdown[0].image
    }
  },
    watch: {
        '$route': function () {
            this.products = []
            this.getData();
        },
        deep: true,
        immediate: true,
    },


}
</script>

<style scoped>

.container {
  padding: 60px;
  position: center;
}

.img {
  width: 300px;
  height: 300px;
  float: right;
}
body {
  margin: 0;
}

#over img {
  margin-left: auto;
  margin-right: auto;
  display: block;
}
</style>


