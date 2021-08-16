<template>
  <v-container fluid>
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
      <v-col v-for="char in characters" :key="char.id" cols="12">
        <v-hover v-slot:default="{ hover }">
          <v-card
            :elevation="hover ? 10 : 50"
            outlined
            @mouseover.native="updateHover(char.id)"
            @mouseleave.native="leaveHover()"
            v-on:click="updateMouseSelect(char.id)"
            :disabled="
              mouseSelectedCharacterID != -1 &&
              mouseSelectedCharacterID != char.id
            "
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
              <v-row flex>
                <v-col cols="auto">
                  <v-btn
                    class="ml-1 mt-1"
                    outlined
                    small
                    :href="'https://www.marvel.com/comics/' + char.url"
                    target="_blank"
                  >
                    CHECK CHARACTER
                  </v-btn>
                </v-col>
                <v-col cols="auto">
                  <v-btn
                    class="ml-1 mt-1"
                    outlined
                    small
                    @click="newSearch(char.name)"
                  >
                    CHECK CONNECTION
                  </v-btn>
                </v-col>
              </v-row>
            </v-card-actions>
          </v-card>
        </v-hover>
      </v-col>
    </v-row>
  </v-container>
</template>


<script>
import store from "../store";
export default {
  name: "CharacterList",
  data() {
    return {
      characters: [],
    };
  },
  methods: {
    updateHover(id) {
      if (id != store.getters.hoverCharacterID) {
        store.dispatch("updateHoverCharacterID", id);
      }
    },
    leaveHover() {
      store.dispatch("updateHoverCharacterID", -1);
    },
    updateMouseSelect(id) {
      if (this.mouseSelectedCharacterID == -1) {
        store.dispatch("updateMouseSelectedCharacterID", id);
      } else {
        store.dispatch("updateMouseSelectedCharacterID", -1);
      }
    },
    // sort characters based on number of appearances
    sort_characters(obj) {
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
      if (val != null) {
        store.dispatch("updateSelectedCharacterName", val);
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
      if (newStage == "FINISHED") {
        // search complete, we can start appending data
        this.characters = this.sort_characters(
          store.getters.connectedCharacterInfos
        );
      }
    },
  },
};
</script>