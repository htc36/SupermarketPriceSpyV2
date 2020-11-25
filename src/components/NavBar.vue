<template >
<!--  <div id="app" class="container is-fluid" style="padding-left: 0px; padding-right: 0px; padding-bottom: 25px" >-->
    <div style="padding-bottom: 30px">
    <b-navbar style="background-color: #7bb679">
      <template slot="brand">
        <h1 style="padding-left: 10px; padding-top: 13px; cursor: pointer; color: white" @click="clickHome">Supermarket PriceSpy </h1>
      </template>
      <template slot="start">
        <div>
<!--        <b-field group-multiline grouped style="padding-left: 3em">-->
        <b-field style="">
          <b-select v-model="location" class="location">
            <option>Pak-n-Save</option>
            <option>Countdown</option>
          </b-select>
          <b-input placeholder="Search..." style="align-self: center" type="search" class="searchInput" v-model="searchQuery" @keyup.native.enter="searchForItem" >
          </b-input>
          <font-awesome-icon icon="search" size="2x" @click="searchForItem" style="color: white" class="search"/>
        </b-field>
        </div>

      </template>

    </b-navbar>
    </div>

<!--  </div>-->
</template>

<script>
    export default {
        name: "Navbar",
        data () {
            return {
                searchQuery: '',
                bottom:false,
                location:"Countdown",
                routeQuery: {}
            }
        },
        methods: {
            searchForItem() {
                this.routeQuery.search = this.searchQuery
                this.getSearchLocation()
                this.$router.push({ path: '/', query: this.routeQuery})
            },
            updateUrl: function () {
                this.$router.push({query: this.routeQuery});
            },
            getSearchLocation() {
                if (this.$route.query.location == "Countdown"){
                    this.routeQuery.location = "Countdown"
                } else if (this.$route.query.location == "Pak-n-Save") {
                    this.routeQuery.location = "Pak-n-Save"
                } else {
                    this.routeQuery.location = "Countdown"
                }
                this.updateUrl()
                console.log(this.routeQuery)
            },
            clickHome() {
                this.routeQuery.search = ""
                this.$router.push({ path: '/', query: this.routeQuery})
            }
        },
        watch: {
            location() {
                this.routeQuery.location = this.location
                this.updateUrl()
            },
            '$route': function () {
              if (this.$route.query.location == "Pak-n-Save") {
                this.location = "Pak-n-Save"
              }
            },
            deep: true,
            immediate: true,
        },
        mounted() {
            this.getSearchLocation()
            this.searchQuery = this.$route.query.search != null ? this.$route.query.search : ""
            if (this.$route.query.location == "Pak-n-Save") {
              this.location = "Pak-n-Save"
            }

        },
    }
</script>

<style>
  .searchInput {
    width: 40em;
    padding-top: 6px;
  }
  .search {
    padding-top: 12px;
    font-size: 2.5em;
    cursor: pointer;
  }
  .location {
    padding-left: 5px;
    padding-top: 6px;
  }
</style>
