<template >
<!--  <div id="app" class="container is-fluid" style="padding-left: 0px; padding-right: 0px; padding-bottom: 25px" >-->
    <b-navbar type="is-primary" >
      <template slot="brand">
        <h1 style="padding-left: 10px; padding-top: 13px; cursor: pointer;" @click="$router.push('/')">Supermarket PriceSpy </h1>
      </template>
      <template slot="start">
        <div>
<!--        <b-field group-multiline grouped style="padding-left: 3em">-->
        <b-field>
          <b-select v-model="location" class="location">
            <option>Pak-n-Save</option>
            <option>Countdown</option>
          </b-select>
          <b-input placeholder="Search..." style="align-self: center" type="search" class="searchInput" v-model="searchQuery" >
          </b-input>
          <font-awesome-icon icon="search" size="2x" @click="searchForItem"  class="search" />
          <h3>{{location}}</h3>
        </b-field>
        </div>

      </template>

    </b-navbar>

<!--  </div>-->
</template>

<script>
    export default {
        name: "Navbar",
        data () {
            return {
                searchQuery: '',
                bottom:false,
                location:"Countdown"
            }
        },
        methods: {
            searchForItem() {
                this.$router.push('/?search=' + this.searchQuery)
            },
            getSearchLocation() {
                if (this.$route.query.location == "Countdown"){
                    this.location = "Countdown"
                } else if (this.$route.query.location == "Pak-n-Save") {
                    this.location = "Pak-n-Save"
                } else {
                    this.location = "Countdown"
                }
            }
        },
        watch: {
            location() {
                this.$router.push('?location=' + this.location)
            }
        },
        mounted() {
            this.getSearchLocation()
            this.searchQuery = this.$route.query.search != null ? this.$route.query.search : ""

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
