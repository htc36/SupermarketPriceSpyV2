<template>
  <div class="container" style="background-color: white">
    <div>
      <div class="img">
        <b-image v-if="countdown != null"
                 :src="imageName"></b-image>
      </div>

      <div>
        <h1 class="title is-3" style="float:left;">{{ displayName }}</h1>
        <h1 class="title is-3" style="float: left">${{ countdown.salePrice }}</h1>
      </div>

<!--      sort this out pls i dont get itttttttt why tf do i need to many breaks-->
      <br>
      <br>
      <br>
      <br>
      <br>

      <div>
        <h1 class="subtitle is-5" style="float:left;">{{ countdown.volSize }}</h1>
      </div>


      <div>
        <table style="width:80%;">
          <caption class="subtitle is-5" style="float: left;">Price Comparison</caption>
          <tr>
            <th>Store</th>
            <th>Product Name</th>
            <th>Current Price</th>
          </tr>
          <tr>
            <td>Countdown</td>
            <td>{{ countdown.name }}</td>
            <td>${{ countdown.salePrice }}</td>
          </tr>
            <tr v-if="pakSave.length !== 0">
              <td>Paknsave</td>
              <td>{{ pakSave[0].name }}</td>
              <td>${{ pakSave[0].price[pakSave[0].price.length - 1] }}</td>
            </tr>
        </table>

      </div>

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
      layout: {
        title: "Price History",
        hovermode: "x",
        spikesnap: "cursor",
        // hoverinfo: "all",
        hoverformat: "%H~%M~%S.%2f",
        spikedistance: 100,
        xaxis: {'showspikes': true},
      }
    }
  },
  methods: {
    getData() {
      let url = "http://45.76.124.20:8080/api/pakNsave/getSingleLinkedProductHistory?code=" + this.$route.params.id + "&location=Taupo"
      axios.get(url)
          .then(response => {
            this.dates = response.data.dates
            this.countdown = response.data.result.countdown
            this.pakSave = response.data.result.paknsave
            this.setPlotPoints()
          })
          .catch(e => {
            this.errors.push(e)
          })
    },
    setPlotPoints() {
      let countdownX = []
      let pakSaveX = []
      if (this.countdown.length != 0) {
        for (const dateIndex of this.countdown.date) {
          const date = this.dates[dateIndex].split("/")
          console.log(this.dates[dateIndex])
          const month = parseInt(date[1]) - 1
          const dateObj = new Date(date[2], month, date[0])
          countdownX.push(dateObj)
          console.log(dateObj)
        }
      }
      if (this.pakSave.length != 0) {
        for (const dateIndex of this.pakSave[0].date) {
          const date = this.dates[dateIndex].split("/")
          const dateObj = new Date(date[2], date[1], date[0])
          pakSaveX.push(dateObj)
        }
      }
      const countdownPoints = {
        x: countdownX,
        y: this.countdown.price,
        type: "scatter",
        name: "Countdown"

      }
      this.data.push(countdownPoints)
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
    displayName: function () {
      const brand = this.countdown.brand.replace(/\w\S*/g, function (txt) {
        return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
      });
      const name = this.countdown.name.replace(/\w\S*/g, function (txt) {
        return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
      });
      return brand + " " + name
    },

    imageName: function () {
      return "https://static.countdown.co.nz/assets/product-images/big/" + this.countdown.image
    }
  }

}
</script>

<style scoped>

.container {
  padding: 60px;
  margin-top: 20px;
  position: center;
}

.img {
  width: 300px;
  height: 300px;
  float: right;
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