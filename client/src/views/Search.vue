<template>
  <div id="pageContainer">
    <SearchBar />
    <div id="container">
      <CharacterList />

      <div class="pane">
        <SVGGraph />
      </div>
      <v-container class="comic-and-author">
        <v-row>
          <v-col cols="6">
            <div class="pane" id="right">
              <ComicList />
            </div>
          </v-col>
          <v-col cols="6">
            <div class="pane" id="right">
              <AuthorList />
            </div>
          </v-col>
        </v-row>
      </v-container>
    </div>
  </div>
</template>

<script>
// @ is an alias to /src
import store from "../store";
import SearchBar from "@/components/SearchBar.vue";
import CharacterList from "@/components/CharacterList.vue";
import ComicList from "@/components/ComicList.vue";
import SVGGraph from "@/components/SVGGraph.vue";
import AuthorList from "@/components/AuthorList.vue";

export default {
  name: "Search",
  components: {
    SearchBar,
    CharacterList,
    ComicList,
    SVGGraph,
    AuthorList,
  },
  data() {
    return {};
  },
  computed: {
    selectedCharacterName() {
      return store.getters.selectedCharacterName;
    },
    api_url() {
      return store.getters.api_url;
    },
  },
  watch: {
    api_url(val) {
      if (val != "") {
        store.dispatch("getCharacterNameAndID");
        store.dispatch("getQueryCount");
      }
    },
  },
  mounted() {},
  created() {
    store.dispatch("getApiUrl");
    if (this.api_url != "") {
      store.dispatch("getCharacterNameAndID");
      store.dispatch("getQueryCount");
    }
  },
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
  height: 69vh;
  max-height: 69vh;
  overflow: scroll;
  /* border: solid 2px; */
  flex: 1 1 auto;
  width: 46vw;
  text-align: left;
}

#left {
  /* border-color: yellow; */
  width: 20vw;
}
.comic-and-author {
  width: 34vw;
  /* height: 10%; */
}

#right {
  /* border-color: red; */
  width: 17vw;
}
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
  overflow: hidden;
  text-rendering: optimizeSpeed;
}
</style>