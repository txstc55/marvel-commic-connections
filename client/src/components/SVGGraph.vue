<template>
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="100%"
    height="100%"
    id="svg"
    @mouseover="mouseover"
    @mouseout="mouseout"
  >
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
      mouseStartPosition: { x: 0, y: 0 },
      mousePosition: { x: 0, y: 0 },
      viewboxStartPosition: { x: 0, y: 0 },
      viewboxPosition: { x: 0, y: 0 },
      viewboxSize: { x: 0, y: 0 },
      viewboxScale: 1.0,
      characters: [],
      shapeMap: {},
      svg: null,
      svgns: "http://www.w3.org/2000/svg",
      mouseDown: false,
      totalComics: -1,
      gradientRect: null,
      textLow: null,
      textHigh: null,
      lastHover: null,
    };
  },
  methods: {
    parse_rgb_string(rgb) {
      rgb = rgb.replace(/[^\d,]/g, "").split(",");
      return rgb;
    },
    getDim() {
      var svg = document.getElementById("svg");
      this.width = svg.clientWidth;
      this.height = svg.clientHeight;
    },
    windowResize() {
      this.getDim();
      this.viewboxSize = { x: this.width, y: this.height };
      this.setviewbox();
    },
    // draw all the nodes
    computeColor(fraction) {
      return (
        "rgba(" +
        Math.ceil(20 - 20 * fraction) +
        ", " +
        Math.ceil(181 - 181 * fraction) +
        ", " +
        Math.ceil(224 - 154 * fraction) +
        ", 0.8)"
      );
    },
    mouseover() {
      document.body.style.overflow = "hidden";
    },
    mouseout() {
      document.body.style.overflow = "auto";
      this.mouseDown = false;
    },
    drawNodes() {
      const center = { x: this.width / 2, y: this.height / 2 };
      const lineLength = Math.min(center.x, center.y) * 0.9;
      var radius =
        Object.keys(this.characters).length > 0
          ? Math.max(
              1,
              Math.floor(lineLength / Object.keys(this.characters).length)
            )
          : 0;

      radius *= Math.max(
        0.5,
        Math.log2(Object.keys(this.characters).length) - 3
      );
      radius = Math.min(radius, 0.025 * lineLength);

      const degree =
        Object.keys(this.characters).length > 0
          ? (2 * Math.PI) / (Object.keys(this.characters).length - 1)
          : 0;
      var count = 0;
      var relevanceScalar = 1.0;
      for (const [key, value] of Object.entries(this.characters)) {
        var circle = document.createElementNS(this.svgns, "circle");
        var text = document.createElementNS(this.svgns, "text");
        // var line = document.createElementNS(this.svgns, "line");
        if (key == this.selectedCharacterID) {
          circle.setAttributeNS(null, "cx", center.x);
          circle.setAttributeNS(null, "cy", center.y);
          circle.setAttributeNS(
            null,
            "r",
            Math.ceil(radius * 2 * Math.sqrt(2))
          );
          text.setAttributeNS(null, "x", center.x);
          text.setAttributeNS(
            null,
            "y",
            center.y + 1 * Math.ceil(radius * 2 * Math.sqrt(2))
          );
          relevanceScalar = 2.0;
        } else {
          relevanceScalar =
            1.3 - Math.sqrt(Math.sqrt(value.comics.length / this.totalComics));
          var randomScalar = Math.random() * 0.1 + 0.95;
          const x =
            center.x +
            randomScalar *
              relevanceScalar *
              lineLength *
              Math.sin(count * degree);
          const y =
            center.y +
            randomScalar *
              relevanceScalar *
              lineLength *
              Math.cos(count * degree);
          circle.setAttributeNS(null, "cx", x);
          circle.setAttributeNS(null, "cy", y);
          circle.setAttributeNS(
            null,
            "r",
            2 *
              radius *
              Math.sqrt((2.0 * value.comics.length) / this.totalComics)
          );
          circle.setAttributeNS(null, "onmouseout", "");
          text.setAttributeNS(null, "x", x);
          text.setAttributeNS(
            null,
            "y",
            y +
              1 *
                2 *
                radius *
                Math.sqrt((2.0 * value.comics.length) / this.totalComics)
          );

          count += 1;
        }
        circle.setAttributeNS(
          null,
          "style",
          "fill: " + this.computeColor(value.comics.length / this.totalComics)
        );
        circle.setAttributeNS(null, "class", "draggable");
        circle.setAttributeNS(null, "id", value.id);
        text.setAttributeNS(null, "text-anchor", "middle");
        text.setAttributeNS(null, "dominant-baseline", "hanging");
        text.setAttributeNS(
          null,
          "font-size",
          Math.ceil(
            1.5 *
              Math.sqrt((2.0 * value.comics.length) / this.totalComics) *
              radius
          ) + "px"
        );
        text.setAttributeNS(null, "text-rendering", "optimizeSpeed");

        var textNode = document.createTextNode(value.name);
        text.appendChild(textNode);

        this.svg.appendChild(circle);
        this.svg.appendChild(text);
        this.shapeMap[parseInt(key)] = {
          shape: circle,
          text: text,
          offset:
            1 *
            2 *
            radius *
            Math.sqrt((2.0 * value.comics.length) / this.totalComics),
        };
      }
    },
    // create the gradient bar
    createGradientBar() {
      var defs = document.createElementNS(this.svgns, "defs");
      var gradient = document.createElementNS(this.svgns, "linearGradient");
      this.gradientRect = document.createElementNS(this.svgns, "rect");
      this.textLow = document.createElementNS(this.svgns, "text");
      this.textLow.setAttributeNS(null, "text-anchor", "middle");
      this.textLow.setAttributeNS(null, "dominant-baseline", "hanging");
      var textNodeLow = document.createTextNode("0");
      this.textLow.appendChild(textNodeLow);
      this.svg.appendChild(this.textLow);

      this.textHigh = document.createElementNS(this.svgns, "text");
      this.textHigh.setAttributeNS(null, "text-anchor", "middle");
      this.textHigh.setAttributeNS(null, "dominant-baseline", "hanging");
      var textNodeHigh = document.createTextNode(this.totalComics);
      this.textHigh.appendChild(textNodeHigh);
      this.svg.appendChild(this.textHigh);

      // Store an array of stop information for the <linearGradient>
      var stops = [
        {
          color: "rgba(20, 181, 224, 0.8)",
          offset: "0%",
        },
        {
          color: "rgba(0, 0, 70, 0.8)",
          offset: "100%",
        },
      ];

      // Parses an array of stop information and appends <stop> elements to the <linearGradient>
      for (var i = 0, length = stops.length; i < length; i++) {
        // Create a <stop> element and set its offset based on the position of the for loop.
        var stop = document.createElementNS(this.svgns, "stop");
        stop.setAttribute("offset", stops[i].offset);
        stop.setAttribute("stop-color", stops[i].color);

        // Add the stop to the <lineargradient> element.
        gradient.appendChild(stop);
      }

      // Apply the <lineargradient> to <defs>
      gradient.id = "Gradient";
      gradient.setAttribute("x1", "0");
      gradient.setAttribute("x2", "1");
      gradient.setAttribute("y1", "0");
      gradient.setAttribute("y2", "0");
      defs.appendChild(gradient);

      // Setup the <rect> element.
      this.gradientRect.setAttribute("fill", "url(#Gradient)");
      this.gradientRect.setAttribute("width", "30%");
      this.gradientRect.setAttribute("height", "2%");
      this.gradientRect.setAttribute("x", "10px");
      this.gradientRect.setAttribute("y", "20px");

      this.svg.appendChild(defs);
      this.svg.appendChild(this.gradientRect);
      this.setviewbox();
    },
    positionGradient(x, y, scale) {
      this.gradientRect.setAttribute("x", x + 10 * scale + "px");
      this.gradientRect.setAttribute("y", y + 20 * scale + "px");
      this.textLow.setAttribute("x", x + 10 * scale + "px");
      this.textLow.setAttribute(
        "y",
        y + (20 + 0.02 * this.height) * scale + "px"
      );
      this.textLow.setAttributeNS(
        null,
        "font-size",
        Math.ceil(15 * scale) + "px"
      );
      this.textHigh.setAttribute(
        "x",
        x + (0.3 * this.width + 10) * scale + "px"
      );
      this.textHigh.setAttribute(
        "y",
        y + (20 + 0.02 * this.height) * scale + "px"
      );
      this.textHigh.setAttributeNS(
        null,
        "font-size",
        Math.ceil(15 * scale) + "px"
      );
    },

    setviewbox() {
      var vp = { x: 0, y: 0 };
      var vs = { x: 0, y: 0 };

      vp.x = this.viewboxPosition.x;
      vp.y = this.viewboxPosition.y;

      vs.x = this.viewboxSize.x * this.viewboxScale;
      vs.y = this.viewboxSize.y * this.viewboxScale;

      this.svg.setAttribute(
        "viewBox",
        vp.x + " " + vp.y + " " + vs.x + " " + vs.y
      );
      this.positionGradient(vp.x, vp.y, this.viewboxScale);
    },
    mousedown(e) {
      this.mouseStartPosition.x = e.pageX;
      this.mouseStartPosition.y = e.pageY;

      this.viewboxStartPosition.x = this.viewboxPosition.x;
      this.viewboxStartPosition.y = this.viewboxPosition.y;
      this.mouseDown = true;
      this.svg.addEventListener("mouseup", this.mouseup);
    },
    mouseup() {
      this.mouseDown = false;
      this.svg.removeEventListener("mouseup", this.mouseup);
    },
    mousemove(e) {
      if (this.mouseSelectedCharacterID == -1) {
        if (e.target.classList.contains("draggable")) {
          if (e.target.id != store.getters.hoverCharacterID) {
            store.dispatch("updateHoverCharacterID", e.target.id);
          }
        } else {
          if (store.getters.hoverCharacterID != -1) {
            store.dispatch("updateHoverCharacterID", -1);
          }
        }
      }
      this.mousePosition.x = e.offsetX;
      this.mousePosition.y = e.offsetY;
      if (this.mouseDown) {
        if (this.hoverCharacterID != -1) {
          var CTM = this.svg.getScreenCTM();
          var coord = {
            x: (e.clientX - CTM.e) / CTM.a,
            y: (e.clientY - CTM.f) / CTM.d,
          };
          this.shapeMap[this.hoverCharacterID].shape.setAttributeNS(
            null,
            "cx",
            coord.x
          );
          this.shapeMap[this.hoverCharacterID].shape.setAttributeNS(
            null,
            "cy",
            coord.y
          );
          this.shapeMap[this.hoverCharacterID].text.setAttributeNS(
            null,
            "x",
            coord.x
          );
          this.shapeMap[this.hoverCharacterID].text.setAttributeNS(
            null,
            "y",
            coord.y + this.shapeMap[this.hoverCharacterID].offset
          );
        } else {
          this.viewboxPosition.x =
            this.viewboxStartPosition.x +
            (this.mouseStartPosition.x - e.pageX) * this.viewboxScale;
          this.viewboxPosition.y =
            this.viewboxStartPosition.y +
            (this.mouseStartPosition.y - e.pageY) * this.viewboxScale;
          this.setviewbox();
        }
      }
    },
    wheel(e) {
      var scale = e.deltaY < 0 ? 0.95 : 1.05;

      if (
        this.viewboxScale * scale < 8 &&
        this.viewboxScale * scale > 1 / 256
      ) {
        var mpos = {
          x: this.mousePosition.x * this.viewboxScale,
          y: this.mousePosition.y * this.viewboxScale,
        };
        var vpos = { x: this.viewboxPosition.x, y: this.viewboxPosition.y };
        var cpos = { x: mpos.x + vpos.x, y: mpos.y + vpos.y };

        this.viewboxPosition.x =
          (this.viewboxPosition.x - cpos.x) * scale + cpos.x;
        this.viewboxPosition.y =
          (this.viewboxPosition.y - cpos.y) * scale + cpos.y;
        this.viewboxScale *= scale;
        this.setviewbox();
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
    hoverCharacterID() {
      return store.getters.hoverCharacterID;
    },
    mouseSelectedCharacterID() {
      return store.getters.mouseSelectedCharacterID;
    },
  },
  watch: {
    stage(newStage) {
      if (newStage == "FINISHED") {
        while (this.svg.lastChild) {
          this.svg.removeChild(this.svg.lastChild);
        }
        this.totalComics = Object.keys(store.getters.comicInfos).length;
        this.shapeArray = [];
        this.textArray = [];
        this.lineArray = [];
        this.shapeMap = {};
        this.characters = store.getters.connectedCharacterInfos;
        this.viewboxStartPosition = { x: 0, y: 0 };
        this.viewboxPosition = { x: 0, y: 0 };
        this.viewboxSize = {
          x: this.svg.clientWidth,
          y: this.svg.clientHeight,
        };
        this.viewboxScale = 1.0;
        this.createGradientBar();
        this.drawNodes();
      }
    },
    hoverCharacterID(newID, oldID) {
      if (oldID != -1) {
        rgbString = this.parse_rgb_string(
          this.shapeMap[oldID].shape.style.fill
        );
        r = 255 - rgbString[0];
        g = 255 - rgbString[1];
        b = 255 - rgbString[2];
        this.shapeMap[oldID].shape.style.fill =
          "rgba(" + r + ", " + g + ", " + b + ", 0.8)";
      }
      if (newID != -1) {
        var rgbString = this.parse_rgb_string(
          this.shapeMap[newID].shape.style.fill
        );
        var r = 255 - rgbString[0];
        var g = 255 - rgbString[1];
        var b = 255 - rgbString[2];
        this.shapeMap[newID].shape.style.fill =
          "rgba(" + r + ", " + g + ", " + b + ", 0.8)";
      }
    },
    mouseSelectedCharacterID(newID, oldID) {
      if (oldID != -1) {
        rgbString = this.parse_rgb_string(
          this.shapeMap[oldID].shape.style.fill
        );
        r = 255 - rgbString[0];
        g = 255 - rgbString[1];
        b = 255 - rgbString[2];
        this.shapeMap[oldID].shape.style.fill =
          "rgba(" + r + ", " + g + ", " + b + ", 0.8)";
      }
      if (newID != -1) {
        var rgbString = this.parse_rgb_string(
          this.shapeMap[newID].shape.style.fill
        );
        var r = 255 - rgbString[0];
        var g = 255 - rgbString[1];
        var b = 255 - rgbString[2];
        this.shapeMap[newID].shape.style.fill =
          "rgba(" + r + ", " + g + ", " + b + ", 0.8)";
      }
    },
  },
  created() {
    window.addEventListener("resize", this.getDim);
    window.addEventListener("resize", this.windowResize);
  },
  destroyed() {
    window.removeEventListener("resize", this.getDim);
    window.removeEventListener("resize", this.windowResize);
  },
  mounted() {
    this.svg = document.getElementById("svg");
    this.width = this.svg.clientWidth;
    this.height = this.svg.clientHeight;
    this.viewboxSize.x = this.width;
    this.viewboxSize.y = this.height;
    this.svg.addEventListener("mousedown", this.mousedown);
    this.svg.addEventListener("mousemove", this.mousemove);
    this.svg.addEventListener("wheel", this.wheel);
  },
};
</script>

<style scoped>
svg {
  /* background-color: cyan; */
  /* height: 80vh; */
  display: block;
  -webkit-touch-callout: none;
  -webkit-user-select: none;
  -khtml-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
  /* text-rendering: optimizeSpeed; */
  /* shape-rendering: optimizeSpeed; */
  /* margin-top: 5px; */
  /* width: 100%; */
  /* position: absolute; */
  /* top:0;
    left:0; */
}
</style>