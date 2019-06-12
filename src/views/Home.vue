<template>
  <div class="home">
    <img alt="Vue logo" src="../assets/logo.png">
    <HelloWorld msg="Welcome to Your Vue.js + TypeScript App"/>
    <div>
     
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import HelloWorld from '@/components/HelloWorld.vue'; // @ is an alias to /src
import config from '../config';

@Component({
  components: {
    HelloWorld,
  },
})
export default class Home extends Vue {

  mounted(){
    console.log('config',config)
  }
}
</script>



