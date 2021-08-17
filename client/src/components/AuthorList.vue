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
              ? ' has ' + this.characterAuthors.length + ' unique creators'
              : ' and ' +
                selectedCharacterName +
                ' share ' +
                this.characterAuthors.length +
                ' unique creators')
          "
        ></p>
      </v-col>
      <div class="pane" @scroll="onScroll" id="authorDiv">
        <v-row dense>
          <v-col
            v-for="authorID in characterAuthors.slice(0, maximumLoad)"
            :key="authorID"
            cols="12"
          >
            <v-card outlined round class="mx-auto">
              <div class="d-flex flex-no-wrap justify-space-between">
                <div>
                  <v-card-title class="text-h7" v-text="authors[authorID].name">
                  </v-card-title>
                  <v-card-subtitle class="text-subtitle-2">
                    Total Comic Participations:
                    {{ authors[authorID].comic_count }}
                    <br />
                    Comics involving
                    {{
                      currentCharacter.name +
                      (currentCharacter.id == selectedCharacterID
                        ? ""
                        : " and " + selectedCharacterName) +
                      ": "
                    }}
                    {{ authors[authorID].character_comic_count }}
                  </v-card-subtitle>
                  <v-card-actions>
                    <v-btn
                      class="ml-2 mt-2"
                      outlined
                      small
                      :href="
                        'https://www.marvel.com/comics/' + authors[authorID].url
                      "
                      target="_blank"
                    >
                      CHECK CREATOR
                    </v-btn>
                  </v-card-actions>
                </div>
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
  name: "AuthorList",
  data() {
    return {
      comics: {}, // all the comics for this character
      authors: {}, // all the authors for this character
      currentCharacter: null, // the current selected character (hover)
      loadingCharacterInfo: true,
      maximumLoad: 20,
      authorCount: 0, // how many authors
      characterAuthors: [], // the authors for the current hovered character
    };
  },
  methods: {
    onScroll({ target: { scrollTop, clientHeight, scrollHeight } }) {
      // we want to limit how many comics to show each time
      // for the sake of a fluent experience
      if (scrollTop + clientHeight >= scrollHeight) {
        this.maximumLoad += 20;
      }
    },
    getOrderedAuthorList(comics) {
      // we need to calculate the how many comics this author has for this specific character
      for (const key of comics) {
        for (const id of this.comics[key]["authors"]) {
          this.authors[id]["character_comic_count"] = 0;
        }
      }
      for (const key of comics) {
        for (const id of this.comics[key]["authors"]) {
          this.authors[id]["character_comic_count"] += 1;
        }
      }
      // get the author ids in order
      var authorList = [];
      for (const comic_id of comics) {
        authorList = authorList.concat(this.comics[comic_id]["authors"]);
      }
      var uniqueAuthorList = [...new Set(authorList)];
      let me = this;
      uniqueAuthorList.sort(function (first, second) {
        return (
          me.authors[second]["character_comic_count"] -
          me.authors[first]["character_comic_count"]
        );
      });
      this.characterAuthors = uniqueAuthorList;
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
      // whenever we finished loading a character
      // we want to modify the result for rendering
      if (newStage == "FINISHED") {
        this.maximumLoad = 20;
        this.comics = store.getters.comicInfos;
        this.authors = store.getters.authorInfos;
        // if there is no comic, we still need to create
        // one character, itself
        if (Object.keys(this.comics).length == 0) {
          this.currentCharacter = {
            name: this.selectedCharacterName,
            id: this.selectedCharacterID,
            comics: [],
            url: "characters",
          };
        } else {
          this.loadingCharacterInfo = true;
          this.currentCharacter =
            store.getters.connectedCharacterInfos[this.selectedCharacterID];
        }
        this.getOrderedAuthorList(this.currentCharacter.comics);
        this.loadingCharacterInfo = false;
      }
    },
    async hoverCharacterID(newCharacterID) {
      // whenever we hover on a character
      // we will need to change the authors etc
      // to match the hovered on character
      this.maximumLoad = 20;
      document.getElementById("authorDiv").scrollTop = 0;
      if (newCharacterID != -1 && Object.keys(this.comics).length > 0) {
        this.loadingCharacterInfo = true;
        this.currentCharacter =
          store.getters.connectedCharacterInfos[newCharacterID];
        this.getOrderedAuthorList(this.currentCharacter.comics);
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

