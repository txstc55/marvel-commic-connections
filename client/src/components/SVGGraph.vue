<template>
  <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" id="svg">
    Sorry, your browser does not support inline SVG.
  </svg>
</template>

<script>
import store from "../store"; // import store
export default {
  name: "SVGGraph",
  data() {
    return {
      width: 0,
      height: 0,
      viewboxStartPosition: { x: 0, y: 0 },
      viewboxPosition: { x: 0, y: 0 },
      viewboxSize: { x: 0, y: 0 },
      viewboxScale: 1.0,
      shapeArray: [],
      textArray: [],
      lineArray: [],
      characters: [],
      svg: null,
      svgns: "http://www.w3.org/2000/svg",
    };
  },
  methods: {
    getDim() {
      var svg = document.getElementById("svg");
      this.width = svg.clientWidth;
      this.height = svg.clientHeight;
    },
    drawNodes() {
      const center = { x: this.width / 2, y: this.height / 2 };
      const lineLength = Math.min(center.x, center.y) * 0.8;
      var radius =
        Object.keys(this.characters).length > 0
          ? Math.max(
              1,
              Math.floor(lineLength / Object.keys(this.characters).length)
            )
          : 0;
      if (Object.keys(this.characters).length <= 16) {
        radius /= (5 - Math.log2(Object.keys(this.characters).length)) * 2;
      } else {
        radius *= Math.log2(Object.keys(this.characters).length) - 4;
      }
      const degree =
        Object.keys(this.characters).length > 0
          ? (2 * Math.PI) / (Object.keys(this.characters).length - 1)
          : 0;
      var count = 0;
      for (const [key, value] of Object.entries(this.characters)) {
        var circle = document.createElementNS(this.svgns, "circle");
        var text = document.createElementNS(this.svgns, "text");
        var line = document.createElementNS(this.svgns, "line");
        if (key == this.selectedCharacterID) {
          circle.setAttributeNS(null, "cx", center.x);
          circle.setAttributeNS(null, "cy", center.y);
          circle.setAttributeNS(null, "r", Math.ceil(radius * 1.5));
          text.setAttributeNS(null, "x", center.x);
          text.setAttributeNS(
            null,
            "y",
            center.y + 0.5 * Math.ceil(radius * 1.5)
          );
          line.setAttributeNS(null, "x2", center.x);
          line.setAttributeNS(null, "y2", center.y);
        } else {
          const randomScalar = Math.random() * 0.9 + 0.3;
          const x =
            center.x + randomScalar * lineLength * Math.sin(count * degree);
          const y =
            center.y + randomScalar * lineLength * Math.cos(count * degree);
          circle.setAttributeNS(null, "cx", x);
          circle.setAttributeNS(null, "cy", y);
          circle.setAttributeNS(null, "r", radius);
          text.setAttributeNS(null, "x", x);
          text.setAttributeNS(null, "y", y + 0.5 * radius);
          line.setAttributeNS(null, "x2", x);
          line.setAttributeNS(null, "y2", y);
          count += 1;
        }
        circle.setAttributeNS(
          null,
          "style",
          "fill: none; stroke: blue; stroke-width: 1px;"
        );
        text.setAttributeNS(null, "text-anchor", "middle");
        text.setAttributeNS(null, "dominant-baseline", "hanging");
        text.setAttributeNS(null, "font-size", Math.ceil(1.5 * radius) + "px");
        line.setAttributeNS(null, "x1", center.x);
        line.setAttributeNS(null, "y1", center.y);
        line.setAttributeNS(null, "stroke", "black");
        var textNode = document.createTextNode(value.name);
        text.appendChild(textNode);
        this.svg.appendChild(line);
        this.svg.appendChild(circle);
        this.svg.appendChild(text);

        this.shapeArray.push(circle);
        this.textArray.push(text);
        this.lineArray.push(line);
      }
    },
  },
  computed: {
    stage() {
      return store.getters.stage;
    },
    selectedCharacterID() {
      return store.getters.selectedCharacterID;
    },
  },
  watch: {
    stage(newStage) {
      if (newStage == "FINISHED") {
        while (this.svg.lastChild) {
          this.svg.removeChild(this.svg.lastChild);
        }
        this.shapeArray = [];
        this.textArray = [];
        this.lineArray = [];
        this.characters = store.getters.connectedCharacterInfos;
        this.drawNodes();
      }
    },
  },
  created() {
    window.addEventListener("resize", this.getDim);
  },
  destroyed() {
    window.removeEventListener("resize", this.getDim);
  },
  mounted() {
    this.svg = document.getElementById("svg");
    this.width = this.svg.clientWidth;
    this.height = this.svg.clientHeight;
    this.viewboxSize.x = this.width;
    this.viewboxSize.y = this.height;
    // console.log(this.width, this.height);
  },
};
</script>

<style scoped>
svg {
  /* background-color: cyan; */
  /* height: 80vh; */
  display: block;
  /* margin-top: 5px; */
  /* width: 100%; */
  /* position: absolute; */
  /* top:0;
    left:0; */
}
</style>