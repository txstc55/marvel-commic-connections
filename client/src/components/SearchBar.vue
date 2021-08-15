<template>
  <v-container>
    <h1>Search A Marvel Character</h1>
    <h3>See how many other characters are connected to it</h3>
    <h3>Based on comic book appearances</h3>
    <v-container class="pt-14 px-6">
      <v-autocomplete
        v-model="selectedCharacter"
        :loading="loading"
        :items="items"
        :search-input.sync="search"
        class="mx4"
        hide-details
        hide-no-data
        rounded
        filled
        solo
        clearable
        auto-select-first
        label="Search a marvel character"
      ></v-autocomplete>
    </v-container>
  </v-container>
</template>

<script>
import store from "../store";
export default {
  name: "SearchBar",
  data() {
    return {
      allCharacterNames: [], // record all the character name, initialized on mount
      loading: false, // wheather we are querying for possible items
      selectedCharacter: null, // what is the selected character name
      search: null, // what is being searched
      items: [], // the auto suggest item
    };
  },
  watch: {
    search(val) {
      val && val !== this.select && this.querySelection(val);
    },
    selectedCharacter(val) {
      if (val != null) {
        store.dispatch("selectCharacter", val);
        store.dispatch("updateCharacterInfos");
        store.dispatch("updateMouseSelectedCharacterID", -1);
        store.dispatch("updateHoverCharacterID", -1);
      }
    },
    initialLoad(val) {
      if (val) {
        this.allCharacterNames = store.getters.allCharacterNames;
        console.log("Loaded " + this.allCharacterNames.length + " characters");
        this.selectedCharacter =
          this.allCharacterNames[
            Math.floor(Math.random() * this.allCharacterNames.length)
          ];
        this.search = this.selectedCharacter;
        this.querySelection(this.search);
      }
    },
  },
  methods: {
    querySelection(v) {
      this.loading = true; // now loading selections
      v = (v || "").toLowerCase();
      setTimeout(() => {
        this.items = this.allCharacterNames.filter((e) => {
          const x = (e || "").toLowerCase();
          return x.indexOf(v) > -1;
        });
        this.loading = false;
      }, 200);
    },
  },
  computed: {
    initialLoad() {
      return store.getters.initialLoad;
    },
  },
  created() {},
  mounted() {},
};
</script>
