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
<!--      <div class="img" style="float : right">-->
<!--        <b-image v-if="countdown != null"-->
<!--                 :src="imageName"></b-image>-->
<!--      </div>-->

<!--      <div>-->
<!--        <h1 class="title is-3" style="float:left; ">{{ displayName }} {{volume}} - ${{price}}dddddddddddddddddddddddddddddddddddddddddddddddddddddddddddd</h1>-->
<!--      </div>-->

<!--      sort this out pls i dont get itttttttt why tf do i need to many breaks-->

    </div>

    <br>
    <br>


    <div>
      <Plotly :data="data" :layout="layout" :display-mode-bar="false"></Plotly>
    </div>
  </div>


</template>

<script>
import axios from 'axios';
import {Plotly} from 'vue-plotly'

export default {
  name: "ProductDetails",
  components: {
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
      let url = "http://45.76.124.20:8080/api/" + store + "/getHistory?code=" + this.$route.params.id + "&location=Taupo"
      axios.get(url)
          .then(response => {
            this.dates = response.data.dates
            this.countdown = response.data.result.countdown
            this.pakSave = response.data.result.paknsave
            this.setPlotPoints()
            this.isLoading = false
          })
          .catch(e => {
            this.errors.push(e)
          })
    },
    setPlotPoints() {
      let countdownX = []
      let pakSaveX = []
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
    }
  },
  created() {
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
  }

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


<!--<template>-->
<!--  <div class="container is-fluid"  style="width: 80%; padding-top: 40px">-->
<!--    <div class="tile is-ancestor">-->
<!--      <div class="tile is-vertical">-->
<!--        <div class="tile is-parent ">-->
<!--          <div class="tile is-child box is-7" align="center">-->
<!--            <b-image v-if="countdown != null"-->
<!--                     :src="imageName"-->
<!--                     style="width: 300px; height: 300px"-->
<!--            ></b-image>-->
<!--          </div>-->
<!--          <div class="tile is-child box">-->
<!--            <p class="title">{{displayName}}</p>-->
<!--            <p >{{countdown.volSize}}</p>-->
<!--            <p class="title" align="right" >${{countdown.salePrice}}</p>-->
<!--          </div>-->
<!--      </div>-->
<!--        <div class="tile is-child box">-->
<!--          <Plotly :data="data" :layout="layout" :display-mode-bar="false"></Plotly>-->
<!--        </div>-->
<!--      </div>-->
<!--    </div>-->
<!--  </div>-->


<!--</template>-->

<!--<script>-->
<!--    import axios from 'axios';-->
<!--    import { Plotly } from 'vue-plotly'-->

<!--    export default {-->
<!--        name: "ProductDetails",-->
<!--        components : {-->
<!--          Plotly-->
<!--        },-->
<!--        data() {-->
<!--            return {-->
<!--                dates:[],-->
<!--                countdown:[],-->
<!--                pakSave:[],-->
<!--                data:[],-->
<!--                layout:{-->
<!--                  title: "Price History",-->
<!--                  hovermode: "x",-->
<!--                  spikesnap: "cursor",-->
<!--                  // hoverinfo: "all",-->
<!--                  hoverformat:"%H~%M~%S.%2f",-->
<!--                  spikedistance: 100,-->
<!--                  xaxis: {'showspikes' : true}-->
<!--                }-->

<!--            }-->
<!--        },-->
<!--        methods : {-->
<!--            getData() {-->
<!--                let url = "http://45.76.124.20:8080/api/pakNsave/getSingleLinkedProductHistory?code=" + this.$route.params.id + "&location=Taupo"-->
<!--                axios.get(url)-->
<!--                    .then(response => {-->
<!--                        this.dates = response.data.dates-->
<!--                        this.countdown = response.data.result.countdown-->
<!--                        this.pakSave = response.data.result.paknsave-->
<!--                        this.setPlotPoints()-->
<!--                    })-->
<!--                    .catch(e => {-->
<!--                        this.errors.push(e)-->
<!--                    })-->
<!--            },-->
<!--            setPlotPoints() {-->
<!--              let countdownX = []-->
<!--              let pakSaveX = []-->
<!--              if (this.countdown.length != 0) {-->
<!--                for (const dateIndex of this.countdown.date) {-->
<!--                  const date = this.dates[dateIndex].split("/")-->
<!--                  console.log(this.dates[dateIndex])-->
<!--                  const month = parseInt(date[1]) - 1-->
<!--                  const dateObj = new Date(date[2], month, date[0])-->
<!--                  countdownX.push(dateObj)-->
<!--                  console.log(dateObj)-->
<!--                }-->
<!--              }-->
<!--              if (this.pakSave.length != 0) {-->
<!--                for (const dateIndex of this.pakSave[0].date) {-->
<!--                  const date = this.dates[dateIndex].split("/")-->
<!--                  const dateObj = new Date(date[2], date[1], date[0])-->
<!--                  pakSaveX.push(dateObj)-->
<!--                }-->
<!--              }-->
<!--              const countdownPoints = {-->
<!--                    x: countdownX,-->
<!--                    y: this.countdown.price,-->
<!--                    type:"scatter",-->
<!--                    name: "Countdown"-->

<!--                  }-->
<!--              this.data.push(countdownPoints)-->
<!--              if (pakSaveX.length != 0) {-->
<!--                const pakSavePoints = {-->
<!--                  x: pakSaveX,-->
<!--                  y: this.pakSave[0].price,-->
<!--                  type:"scatter",-->
<!--                  name: "Pak n Save"-->
<!--                }-->
<!--                this.data.push(pakSavePoints)-->
<!--              }-->
<!--            }-->
<!--        },-->
<!--        created() {-->
<!--            this.getData()-->
<!--        },-->
<!--        computed: {-->
<!--            displayName: function () {-->
<!--                const brand = this.countdown.brand.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});-->
<!--                const name = this.countdown.name.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});-->
<!--                return brand + " " + name-->
<!--            },-->

<!--            imageName: function () {-->
<!--                  return "https://static.countdown.co.nz/assets/product-images/big/" + this.countdown.image-->
<!--            }-->
<!--        }-->

<!--    }-->
<!--</script>-->

<!--<style scoped>-->
<!--  .bottom {-->
<!--    position:absolute;-->
<!--    vertical-align: bottom;-->
<!--    align-text: bottom;-->
<!--    alignment: right;-->
<!--  }-->

<!--</style>-->