<template>
  <d3-network
    :net-nodes="nodes"
    :net-links="links"
    :options="options"
    id="universeContainer"
  >
  </d3-network>
</template>
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
      nodes: [],
      links: [],
      options: {
        force: 1500,
        nodeLabels: true,
        linkWidth: 2,
        forces: {
          Center: true,
          X: 1,
          Y: 1,
          ManyBody: true,
          Link: true,
        },
        // size:{ w:600, h:600},
      },
    };
  },
  methods: {
    gradient(color1, color2, ratio) {
      var hex = function (x) {
        x = x.toString(16);
        return x.length == 1 ? "0" + x : x;
      };

      var r = Math.ceil(
        parseInt(color1.substring(0, 2), 16) * ratio +
          parseInt(color2.substring(0, 2), 16) * (1 - ratio)
      );
      var g = Math.ceil(
        parseInt(color1.substring(2, 4), 16) * ratio +
          parseInt(color2.substring(2, 4), 16) * (1 - ratio)
      );
      var b = Math.ceil(
        parseInt(color1.substring(4, 6), 16) * ratio +
          parseInt(color2.substring(4, 6), 16) * (1 - ratio)
      );

      var middle = hex(r) + hex(g) + hex(b);
      return "#" + middle;
    },
    createNodes() {
      var maximumSize = -1;
      const network = store.getters.network;
      this.nodes = [];
      this.links = [];
      for (const [key, value] of Object.entries(network)) {
        var size = Math.log2(value.relatives + 2) * 5;
        this.nodes.push({
          id: key,
          name: value.name,
          _size: size,
          _color: "red",
          _labelClass: "txt40",
        });
        if (size > maximumSize) {
          maximumSize = size;
        }
        for (const cid of value.closest_characters) {
          this.links.push({ sid: key, tid: cid });
        }
      }
      // for (var i = 1; i <= maximumSize + 1; i++) {
      //   this.createCSSSelector(".txt" + i, "font-size:" + i + "px;");
      // }
      for (var node of this.nodes) {
        node._color = this.gradient(
          "b20a2c",
          "fffbd5",
          node._size / maximumSize
        );
        node._size = Math.pow(node._size, 1.2);
        if (Math.floor(node._size) <= 40) {
          node._labelClass = "txt" + Math.floor(node._size);
        }
      }
    },
  },

  computed: {
    networkLoaded() {
      return store.getters.networkLoaded;
    },
  },
  watch: {
    networkLoaded(val) {
      if (val) {
        this.createNodes();
      }
    },
  },
  mounted() {
    if (this.networkLoaded) {
      this.createNodes();
    }
  },
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

.node {
  -webkit-transition: fill 0.5s ease;
  transition: fill 0.5s ease;
  fill: #dcfaf3;
}
.node.selected {
  stroke: #caa455;
}
.node.pinned {
  stroke: rgba(190, 56, 93, 0.6);
}
.link {
  stroke: rgba(147, 177, 194, 0.3);
}
.link,
.node {
  stroke-linecap: round;
}

.node:hover {
  stroke: #be385d;
  stroke-width: 5px;
}

.link-label,
.node-label {
  fill: #2c84a7;
}
.link-label {
  -webkit-transform: translateY(-0.5em);
  transform: translateY(-0.5em);
  text-anchor: middle;
}
.txt1 {
  font-size: 1px;
}
.txt2 {
  font-size: 2px;
}
.txt3 {
  font-size: 3px;
}
.txt4 {
  font-size: 4px;
}
.txt5 {
  font-size: 5px;
}
.txt6 {
  font-size: 6px;
}
.txt7 {
  font-size: 7px;
}
.txt8 {
  font-size: 8px;
}
.txt9 {
  font-size: 9px;
}
.txt10 {
  font-size: 10px;
}
.txt11 {
  font-size: 11px;
}
.txt12 {
  font-size: 12px;
}
.txt13 {
  font-size: 13px;
}
.txt14 {
  font-size: 14px;
}
.txt15 {
  font-size: 15px;
}
.txt16 {
  font-size: 16px;
}
.txt17 {
  font-size: 17px;
}
.txt18 {
  font-size: 18px;
}
.txt19 {
  font-size: 19px;
}
.txt20 {
  font-size: 20px;
}
.txt21 {
  font-size: 21px;
}
.txt22 {
  font-size: 22px;
}
.txt23 {
  font-size: 23px;
}
.txt24 {
  font-size: 24px;
}
.txt25 {
  font-size: 25px;
}
.txt26 {
  font-size: 26px;
}
.txt27 {
  font-size: 27px;
}
.txt28 {
  font-size: 28px;
}
.txt29 {
  font-size: 29px;
}
.txt30 {
  font-size: 30px;
}
.txt31 {
  font-size: 31px;
}
.txt32 {
  font-size: 32px;
}
.txt33 {
  font-size: 33px;
}
.txt34 {
  font-size: 34px;
}
.txt35 {
  font-size: 35px;
}
.txt36 {
  font-size: 36px;
}
.txt37 {
  font-size: 37px;
}
.txt38 {
  font-size: 38px;
}
.txt39 {
  font-size: 39px;
}
.txt40 {
  font-size: 40px;
}
</style>

