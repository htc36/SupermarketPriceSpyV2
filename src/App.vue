<template>
  <div id="app">
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