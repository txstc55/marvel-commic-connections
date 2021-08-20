<template>
  <div class="about">
    <h1>What more can I do with the data:</h1>
    <div
      class="flourish-embed flourish-bar-chart-race"
      data-src="visualisation/7054839"
      id="solo-appear"
    >
    <h2>Who has the most solo comic appearances</h2>
    </div>
  </div>
</template>


<script>
export default {
  name: "more",
  mounted() {
    let externalScript = document.createElement("script");
    externalScript.setAttribute(
      "src",
      "https://public.flourish.studio/resources/embed.js"
    );
    document.getElementById("solo-appear").appendChild(externalScript);
  },
};
</script>