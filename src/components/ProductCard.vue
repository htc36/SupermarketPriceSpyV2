<template>
    <div class="card cardSettings" :loading="loading" max-width="250">
        <div class="test">
          <div align="center" class="card-image" style="padding-top: 3px" @click="viewDetail">
              <b-image
                      :src="product.image"
                      style="width: 150px; height: 150px"
              ></b-image>
          </div>
          <p class="title" @click="viewDetail">{{product.displayName}}</p>
        </div>
        <p style="padding-left: 15px; font-size: 0.9em" class="subtitle is-6">
        </p>

        <p style="text-align: right; padding-right: 15px; padding-bottom: 15px; font-weight: bolder"> ${{product.price}}</p>
    </div>
</template>

<script>
    export default {
        name: "ListItems",
        props: ["product"],
        computed: {
        },
        methods: {
            viewDetail() {
                const id = this.product.id
                this.$router.push('/product/' + id)
            }
        },
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