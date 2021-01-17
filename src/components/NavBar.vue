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
            <option value="paknsave">Pak-n-Save</option>
            <option value="countdown">Countdown</option>
          </b-select>
          <b-input placeholder="Search..." style="align-self: center" type="search" class="searchInput" v-model="searchQuery" @keyup.native.enter="searchForItem" >
          </b-input>
          <font-awesome-icon icon="search" size="2x" @click="searchForItem" style="color: white" class="search"/>
        </b-field>
        </div>

      </template>
      <template slot="end">
        <h1 style="padding-top: 13px; color: white"> Location: </h1>
<!--        <b-select v-model="store" class="location">-->
<!--          <option value='{"countdown":"222", "paknsave":"3333"}'>Albany</option>-->
<!--          <option >Royal Oak</option>-->
<!--          <option>Petone</option>-->
<!--          <option>Taupo</option>-->
<!--          <option>Whangarei</option>-->
<!--       </b-select>-->
        <b-select v-model="store" class="location">
          <option v-for = "store in storeList" :value="store.value" :key="store.value" >{{store.name}}</option>
        </b-select>
      </template>

    </b-navbar>
    </div>

<!--  </div>-->
</template>

<script>
import api from '@/api'

    export default {
        name: "Navbar",
        data () {
            return {
                searchQuery: '',
                bottom:false,
                location:"countdown",
                routeQuery: {},
                store: {
                    "countdown": "2449151",
                    "paknsave": "21ecaaed-0749-4492-985e-4bb7ba43d59c"
                },
                storeList: [{"name" : "Albany" , "value" : {"countdown" : "123123131", "paknsave" : "hsdfsfs"}}]
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
                if (this.$route.query.location == "countdown"){
                    this.routeQuery.location = "countdown"
                } else if (this.$route.query.location == "paknsave") {
                    this.routeQuery.location = "paknsave"
                } else {
                    this.routeQuery.location = "countdown"
                }
            },
            getStore() {
                if (this.$route.query.store == null) {
                    this.routeQuery.store = "Albany"
                } else {
                    this.routeQuery.store = this.$route.query.store
                }
            },
            clickHome() {
                this.routeQuery.search = ""
                this.$router.push({ path: '/', query: this.routeQuery})
            },
            loadStoreNames() {
                api.getStoreNames()
                    .then(response => {
                        this.storeList = response.data
                        if (!this.$cookies.isKey('store')){
                            this.$cookies.set('store',this.store);
                        }
                        this.store = this.$cookies.get('store')
                        // this.routeQuery.store = this.store.countdown
                    })
            },
        },
        watch: {
            location() {
                this.routeQuery.location = this.location
                this.updateUrl()
            },
            store() {
                this.routeQuery.store = this.store.countdown
                this.$cookies.set('store',this.store);
                this.updateUrl()
            },
            '$route': function () {
              if (this.$route.query.location == "paknsave") {
                this.location = "paknsave"
              }
            },
            deep: true,
            immediate: true,
        },
        mounted() {
            this.getStore()
            this.getSearchLocation()
            this.updateUrl()
            this.loadStoreNames()
            this.searchQuery = this.$route.query.search != null ? this.$route.query.search : ""
            if (this.$route.query.location == "paknsave") {
              this.location = "paknsave"
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
