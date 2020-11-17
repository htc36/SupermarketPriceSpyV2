<template>
  <div id="app" style="background-color: grey">
    <navbar></navbar>
    <router-view></router-view>
  </div>
</template>

<script>
    import Navbar from "./components/NavBar";
    export default {
        name: 'App',

        components: {
            Navbar
        },

        data: () => ({
            //
        }),
    };
</script>