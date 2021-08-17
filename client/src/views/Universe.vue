<template>
  <d3-network
    :net-nodes="nodes"
    :net-links="links"
    :options="options"
    id="universeContainer"
  >
  </d3-network>
</template>
<style src="vue-d3-network/dist/vue-d3-network.css"></style>
/<script>
import D3Network from "vue-d3-network";
import store from "../store"; // import store
// import panZoom from "vue-panzoom";
export default {
  name: "Universe",
  components: {
    D3Network,
    // panZoom,
  },
  data() {
    return {
      nodes: [
        { id: 1, name: "my node 1" },
        { id: 2, name: "my node 2" },
        { id: 3, _color: "rgb(0, 0, 0)" },
        { id: 4 },
        { id: 5 },
        { id: 6 },
        { id: 7 },
        { id: 8 },
        { id: 9 },
      ],
      links: [
        { sid: 1, tid: 2, _color: "red" },
        { sid: 3, tid: 4, _color: "rebeccapurple" },
        { sid: 4, tid: 5 },
        { sid: 5, tid: 5 },
        { sid: 5, tid: 6 },
        { sid: 7, tid: 8 },
        { sid: 5, tid: 8 },
        { sid: 3, tid: 8 },
        { sid: 7, tid: 9 },
      ],
      options: {
        force: 200,
        nodeLabels: true,
        linkWidth: 5,
        // size:{ w:600, h:600},
      },
    };
  },
  computed: {
    networkLoaded() {
      return store.getters.networkLoaded;
    },
  },
  watch: {
    networkLoaded(val) {
      if (val) {
        console.log("je");
        const network = store.getters.network;
        this.nodes = [];
        this.links = [];
        for (const [key, value] of Object.entries(network)) {
          this.nodes.push({
            id: key,
            name: value.name,
            _size: Math.log2(value.relatives + 2)  * 5 ,
          });
          this.links.push({ sid: key, tid: value.closest_character });
        }
      }
    },
  },
  method: {},
  mounted() {},
  created() {
    store.dispatch("getNetwork");
  },
};
</script>

<style>
#universeContainer {
  display: flex;
  flex-flow: column;
  height: 100%;
  max-height: 100%;
}
</style>