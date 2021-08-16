<template>
  <v-container fluid>
    <v-row v-if="stage != 'FINISHED' || loadingCharacterInfo">
      <v-col cols="12" class="mt-6">
        <div class="text-center">
          <v-progress-circular
            indeterminate
            color="primary"
          ></v-progress-circular>
        </div>
      </v-col>
    </v-row>
    <v-row dense v-else>
      <v-col cols="12" dense>
        <p
          class="text-h6"
          v-text="
            currentCharacter.name + 
            (currentCharacter.id == selectedCharacterID
              ? ' co-appeared with ' +
                this.connectCount +
                ' characters in ' +
                currentCharacter.comics.length +
                ' comics'
              : ' co-appeared with ') +
                selectedCharacterName +
                ' in ' +
                currentCharacter.comics.length +
                ' comics'
          "
        ></p>
      </v-col>
      <div class="pane" @scroll="onScroll" id="comicDiv">
        <v-row dense>
          <v-col
            v-for="comicID in currentCharacter.comics.slice(0, maximumLoad)"
            :key="comicID"
            cols="12"
          >
            <v-card outlined round class="mx-auto">
              <div class="d-flex flex-no-wrap justify-space-between">
                <div>
                  <v-card-title class="text-h7" v-text="comics[comicID].name">
                  </v-card-title>
                  <v-card-subtitle v-if="comics[comicID].authors.length == 0">
                  </v-card-subtitle>
                  <v-card-subtitle v-else class="text-subtitle-2">
                    Created By:
                    <span
                      v-for="authorID in comics[comicID].authors"
                      :key="authorID"
                      v-html="authorURL(authorID)"
                    ></span>
                  </v-card-subtitle>
                  <v-card-actions>
                    <v-btn
                      class="ml-2 mt-2"
                      outlined
                      small
                      :href="
                        'https://www.marvel.com/comics/' + comics[comicID].url
                      "
                      target="_blank"
                    >
                      CHECK COMIC
                    </v-btn>
                  </v-card-actions>
                </div>
                <v-avatar
                  class="ml-3 mr-1 mt-5 mb-5"
                  size="30%"
                  tile
                  style="float: right"
                >
                  <v-img :src="comics[comicID].cover"></v-img>
                </v-avatar>
              </div>
            </v-card>
          </v-col>
        </v-row>
      </div>
    </v-row>
  </v-container>
</template>


<script>
import store from "../store";
export default {
  name: "ComicList",
  data() {
    return {
      comics: [],
      authors: [],
      currentCharacter: null,
      loadingCharacterInfo: true,
      maximumLoad: 20,
      connectCount: 0,
    };
  },
  methods: {
    authorURL(id) {
      return (
        '<a href="https://www.marvel.com/comics/' +
        this.authors[id].url +
        '" target= "_blank">' +
        this.authors[id].name +
        "</a>, "
      );
    },

    onScroll({ target: { scrollTop, clientHeight, scrollHeight } }) {
      if (scrollTop + clientHeight >= scrollHeight) {
        this.maximumLoad += 20;
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
    selectedCharacterName() {
      return store.getters.selectedCharacterName;
    },
    mouseSelectedCharacterID() {
      return store.getters.mouseSelectedCharacterID;
    },
    hoverCharacterID() {
      return store.getters.hoverCharacterID;
    },
  },
  watch: {
    async stage(newStage) {
      if (newStage == "FINISHED") {
        this.maximumLoad = 20;
        this.comics = store.getters.comicInfos;
        this.authors = store.getters.authorInfos;
        if (Object.keys(this.comics).length == 0) {
          this.currentCharacter = {
            name: this.selectedCharacterName,
            id: this.selectedCharacterID,
            comics: [],
            url: "characters",
          };
          this.loadingCharacterInfo = false;
          this.connectCount = 0;
        } else {
          this.loadingCharacterInfo = true;
          this.currentCharacter =
            store.getters.connectedCharacterInfos[this.selectedCharacterID];
          this.connectCount =
            Object.keys(store.getters.connectedCharacterInfos).length - 1;
          this.loadingCharacterInfo = false;
        }
      }
    },
    async hoverCharacterID(newCharacterID) {
      this.maximumLoad = 20;
      document.getElementById("comicDiv").scrollTop = 0;
      if (newCharacterID != -1 && Object.keys(this.comics).length > 0) {
        this.loadingCharacterInfo = true;
        this.currentCharacter =
          store.getters.connectedCharacterInfos[newCharacterID];
        this.loadingCharacterInfo = false;
      }
    },
  },
};
</script>

<style scoped>
.pane {
  height: 69vh;
  max-height: 100%;
  overflow: scroll;
  /* border: solid 2px; */
  flex: 1 1 auto;
  width: 17vw;
  /* text-align: left; */
}

/* .comicItem {
  text-align: left;
} */
</style>

