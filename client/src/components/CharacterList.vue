<template>
  <div class="pane" id="left">
    <v-container fluid id="characterContainer">
      <v-row v-if="stage != 'FINISHED'">
        <v-col cols="12" class="mt-6">
          <div class="text-center">
            <v-progress-circular
              indeterminate
              color="primary"
            ></v-progress-circular>
          </div>
        </v-col>
      </v-row>
      <v-row v-else dense>
        <v-col
          v-for="char in characters"
          :key="char.id"
          cols="12"
          :ref="char.id"
        >
          <v-hover v-slot:default="{ hover }">
            <v-card
              :elevation="hover ? 10 : 50"
              outlined
              @mouseover.native="updateHover(char.id)"
              @mouseleave.native="leaveHover(char.id)"
              v-on:click="updateMouseSelect(char.id)"
              :disabled="
                mouseSelectedCharacterID != -1 &&
                mouseSelectedCharacterID != char.id
              "
              :ref="'ch' + char.id"
            >
              <v-card-title class="text-h5" v-text="char.name"> </v-card-title>
              <v-card-text
                v-text="
                  (selectedCharacterID == char.id
                    ? char.name
                    : char.name + ' and ' + selectedCharacterName) +
                  ' appeared in ' +
                  char.comics.length +
                  ' comics' +
                  (selectedCharacterID == char.id
                    ? '. This character connects to ' +
                      (characters.length - 1) +
                      ' other characters.'
                    : ' together.')
                "
                class="text-subtitle-1"
              ></v-card-text>
              <v-card-actions>
                <v-row>
                  <v-col cols="auto">
                    <v-btn
                      class="ml-1 mt-1"
                      outlined
                      small
                      :href="'https://www.marvel.com/comics/' + char.url"
                      target="_blank"
                    >
                      CHECK CHARACTER
                    </v-btn> </v-col
                  ><v-col cols="auto">
                    <v-btn
                      class="ml-1 mt-1"
                      outlined
                      small
                      @click="newSearch(char.name)"
                    >
                      BUILD CONNECTION
                    </v-btn>
                  </v-col>
                </v-row>
              </v-card-actions>
            </v-card>
          </v-hover>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>


<script>
import store from "../store";
export default {
  name: "CharacterList",
  data() {
    return {
      characters: [],
      onCharacterPanel: false,
      leftPane: null,
    };
  },
  methods: {
    updateHover(id) {
      // on hover, we want to change the hoverid to the store
      // for other components to see
      // we also need to change the style of hovered element
      if (id != store.getters.hoverCharacterID) {
        store.dispatch("updateHoverCharacterID", id);
        this.$refs["ch" + id][0].dark = true;
      }
      this.onCharacterPanel = true;
    },
    leaveHover(id) {
      // whenever leave hover, we unset the id
      // and change back the style
      store.dispatch("updateHoverCharacterID", -1);
      this.onCharacterPanel = false;
      this.$refs["ch" + id][0].dark = false;
    },
    updateMouseSelect(id) {
      // once we select a character, we disable all other elements
      if (this.mouseSelectedCharacterID == -1) {
        store.dispatch("updateMouseSelectedCharacterID", id);
      } else {
        store.dispatch("updateMouseSelectedCharacterID", -1);
      }
    },

    sort_characters(obj) {
      // sort characters based on number of appearances
      var items = Object.keys(obj).map(function (key) {
        obj[key]["id"] = key;
        return obj[key];
      });
      if (items.length == 0) {
        items.push({
          name: this.selectedCharacterName,
          id: this.selectedCharacterID,
          comics: [],
          url: "characters",
        });
        return items;
      }
      let me = this;
      items.sort(function (first, second) {
        if (first["id"] == me.selectedCharacterID) {
          return -9999;
        } else if (second["id"] == me.selectedCharacterID) {
          return 9999;
        }
        return second["comics"].length - first["comics"].length;
      });
      return items;
    },
    newSearch(val) {
      // whenever we push that button, it is the equivalent to do a new search
      if (val != null && val != store.getters.selectedCharacterName) {
        store.dispatch("selectCharacter", val);
        store.dispatch("updateCharacterInfos");
        store.dispatch("updateMouseSelectedCharacterID", -1);
        store.dispatch("updateHoverCharacterID", -1);
        store.dispatch("getQueryCount");
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
    stage(newStage) {
      // whenever the stage is changed, we have a new character list
      if (newStage == "FINISHED") {
        // search complete, we can start appending data
        this.characters = this.sort_characters(
          store.getters.connectedCharacterInfos
        );
        this.onCharacterPanel = false;
      }
    },
    hoverCharacterID(id, oldID) {
      // whenever hovered onto character, change styles etc
      if (id != -1 && !this.onCharacterPanel) {
        this.leftPane.scrollTop =
          this.$refs[id][0].offsetTop - this.leftPane.clientHeight / 1.5;
        this.$refs["ch" + id][0].dark = true;
      }
      if (oldID != -1) {
        this.$refs["ch" + oldID][0].dark = false;
      }
    },
  },
  mounted() {
    this.leftPane = document.getElementById("left");
  },
};
</script>

<style scoped>
#left {
  /* border-color: yellow; */
  width: 20vw;
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
</style>