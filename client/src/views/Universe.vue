<template>
  <v-row v-if="!networkLoaded" id="universeContainer">
    <v-col cols="12" class="mt-12">
      <div class="text-center">
        <h2>Loading all character infos is gonna take a while</h2>
        <v-progress-circular
          indeterminate
          color="primary"
          class="mt-12"
        ></v-progress-circular>
      </div>
    </v-col>
  </v-row>
  <v-row v-else id="universeContainer">
    <d3-network
      :net-nodes="nodes"
      :net-links="links"
      :options="options"
      id="universeContainer"
    >
    </d3-network>
  </v-row>
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
      hoverID: -1,
      nodes: [],
      links: [],
      nameToID: {},
      neighborEdges: {},
      options: {
        nodeSize: 20,
        force: 1500,
        nodeLabels: true,
        linkWidth: 2,
        forces: {
          Center: false,
          X: 1,
          Y: 1,
          ManyBody: true,
          Link: true,
        },
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
      // load the network from store
      const network = store.getters.network;
      this.nodes = [];
      this.links = [];
      // we need to store for each node, what are the edges coming in
      for (const key of Object.keys(network)) {
        this.neighborEdges[key] = { position: -1, scale: 1, neighbors: [] };
      }
      // this is used to access all the edges
      var linkid = 0;
      for (const [key, value] of Object.entries(network)) {
        this.nameToID[value.name] = key;
        // sizing based on the number of relatives
        var size = Math.log2(value.relatives + 2) * 5;
        // add the node, and record its position in nodes
        // because for some reason it's not incremental?
        this.neighborEdges[key].position = this.nodes.length;
        this.nodes.push({
          id: key,
          name: value.name,
          _size: size,
          _color: "red",
          _labelClass: "txt40",
        });
        // fix maximum size as 40
        if (size > maximumSize) {
          maximumSize = size;
        }
        for (const cid of value.closest_characters) {
          // add the link
          this.links.push({ sid: key, tid: cid });
          // also record it since we will need it later
          // each link on canvas has the id of "link-[id]"
          this.neighborEdges[cid].neighbors.push({ sid: key, linkid: linkid });
          linkid += 1;
        }
      }
      for (var node of this.nodes) {
        node._color = this.gradient(
          "b20a2c",
          "fffbd5",
          node._size / maximumSize
        );
        // we want to record the original size
        this.neighborEdges[node.id].scale = node._size / maximumSize;
        // size up a bit
        node._size = Math.pow(node._size, 1.2);
        if (Math.floor(node._size) <= 40) {
          // set the text label class
          node._labelClass = "txt" + Math.floor(node._size);
        }
      }
      // this guarantees that the svg is rendered
      this.$nextTick(() => {
        var circles = document.getElementsByTagName("circle");
        let me = this;
        for (const circle of circles) {
          circle.addEventListener("mouseenter", (event) => {
            const name = event.target.attributes.title.value;
            const id = me.nameToID[name];
            me.hoverID = id;
          });
          circle.addEventListener("mouseleave", () => {
            me.hoverID = -1;
          });
        }
      });
    },
    highlightNodes(id) {
      // set the center node to some other color
      this.nodes[this.neighborEdges[id].position]._color = this.gradient(
        "373B44",
        "4286f4",
        this.neighborEdges[id].scale
      );
      // set the neighboring nodes to some other color
      for (const edge of this.neighborEdges[id].neighbors) {
        const nid = edge.sid;
        this.nodes[this.neighborEdges[nid].position]._color = this.gradient(
          "373B44",
          "4286f4",
          this.neighborEdges[nid].scale
        );
        // set the link to other color
        this.links[edge.linkid]._color = "rgba(223, 224, 138, 0.6)";
      }
    },
    dehighlightNodes(id) {
      this.nodes[this.neighborEdges[id].position]._color = this.gradient(
        "b20a2c",
        "fffbd5",
        this.neighborEdges[id].scale
      );
      // set the neighboring nodes to original color
      for (const edge of this.neighborEdges[id].neighbors) {
        const nid = edge.sid;
        this.nodes[this.neighborEdges[nid].position]._color = this.gradient(
          "b20a2c",
          "fffbd5",
          this.neighborEdges[nid].scale
        );
        this.links[edge.linkid]._color = "rgba(147, 177, 194, 0.6)";
      }
    },
  },

  computed: {
    networkLoaded() {
      return store.getters.networkLoaded;
    },
    circleCollection() {
      return document.getElementsByTagName("circle");
    },
  },
  watch: {
    hoverID(newid, oldid) {
      if (oldid != -1) {
        this.dehighlightNodes(oldid);
      }
      if (newid != -1) {
        this.highlightNodes(newid);
      }
    },
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

.node.selected {
  stroke: #caa455;
}
.node.pinned {
  stroke: rgba(190, 56, 93, 0.6);
}
.link {
  stroke: rgba(147, 177, 194, 0.6);
}

.link,
.node {
  stroke-linecap: round;
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

