<template>
  <v-container>
    <h1>Search A Marvel Character</h1>
    <h3>
      See how many other characters are connected to it based on comic book
      appearances
    </h3>
    <h4>Total search count: {{ queryCount }}</h4>
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
      // the search value
      val && val !== this.select && this.querySelection(val);
    },
    selectedCharacter(val) {
      // whenever we start searching
      // fire those functions to the store
      if (val != null) {
        store.dispatch("selectCharacter", val);
        store.dispatch("updateCharacterInfos");
        store.dispatch("updateMouseSelectedCharacterID", -1);
        store.dispatch("updateHoverCharacterID", -1);
        store.dispatch("getQueryCount");
      }
    },
    initialLoad(val) {
      // we want to query a random character on the first load
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
      // don't need to know much its just for what characters to show up
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
    queryCount() {
      return store.getters.queryCount;
    },
  },
  created() {},
  mounted() {
    if (this.initialLoad) {
      this.allCharacterNames = store.getters.allCharacterNames;
      console.log("Loaded completed once: " + this.allCharacterNames.length + " characters");
      this.selectedCharacter =
        this.allCharacterNames[
          Math.floor(Math.random() * this.allCharacterNames.length)
        ];
      this.search = this.selectedCharacter;
      this.querySelection(this.search);
    }
  },
};
</script>
