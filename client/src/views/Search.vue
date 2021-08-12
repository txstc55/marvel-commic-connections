<template>
  <div id="pageContainer">
    <SearchBar />
    <div id="container">
      <div class="pane" id="left">
        <CharacterList />
      </div>
      <div class="pane">
        <CharacterList />
      </div>
      <div class="pane" id="right">
        <ComicList />
      </div>
    </div>
  </div>
</template>

<script>
// @ is an alias to /src
import SearchBar from "@/components/SearchBar.vue";
import CharacterList from "@/components/CharacterList.vue";
import ComicList from "@/components/ComicList.vue";
export default {
  name: "Search",
  components: {
    SearchBar,
    CharacterList,
    ComicList,
  },
  data() {
    return {};
  },
  mounted() {},
};
</script>

<style>
html,
body {
  height: 100%;
  margin: 0;
}

#pageContainer {
  display: flex;
  flex-flow: column;
  height: 100%;
  max-height: 100%;
}

#container {
  /* border-color: black; */
  /* border: solid 2px; */
  flex: 1 1 auto;
  display: flex;
  flex-flow: row;
}
.pane {
  height: 83vh;
  max-height: 100%;
  overflow: scroll;
  /* border: solid 2px; */
  flex: 1 1 auto;
  width: 40vw;
  text-align: left;
}

#left {
  /* border-color: yellow; */
  width: 5vw;
}

#right {
  /* border-color: red; */
  width: 5vw;
}
</style>