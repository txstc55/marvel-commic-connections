import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'

const port = process.env.PORT || 5000; // the port we will be using

// const this.state.api_url = "https://localhost:" + port + "/"

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    api_url: "",
    characterNameAndID: {},
    selectedCharacterName: "", // the character name we are queing
    selectedCharacterID: -1, // the character id we are queing
    selectedCharacterInfos: null, // the information of the selected character
    comicInfos: null, // the infos of the comics this character is in
    connectedCharacterInfos: null, // the characters that are connected to selected character
    authorInfos: null, // all the author infos
    stage: "PREPARING", // what stage of getting info are we in
    hoverCharacterID: -1, // what character we are hovering
    mouseSelectedCharacterID: -1, // what character ID we are selecting
    initialLoad: false, // have we finished the initial loading of characters
    queryCount: "",
    networkLoaded: false,
    network: {},
    creatorNetwork: {},
    creatorNetworkLoaded: false,
  },
  mutations: {
    SET_API_URL(state, url) {
      state.api_url = url;
    },
    SET_SELECTED_CHARACTER_NAME(state, name) {
      state.selectedCharacterName = name;
    },
    SET_SELECTED_CHARACTER_ID(state, id) {
      state.selectedCharacterID = id;
    },
    SET_SELECTED_CHARACTER_INFOS(state, infos) {
      state.selectedCharacterInfos = infos;
    },
    SET_COMIC_INFOS(state, infos) {
      state.comicInfos = infos;
    },
    SET_CONNECTED_CHARACTER_INFOS(state, infos) {
      state.connectedCharacterInfos = infos;
    },
    SET_AUTHOR_INFOS(state, infos) {
      state.authorInfos = infos;
    },
    SET_STAGE(state, stage) {
      state.stage = stage;
    },
    SET_HOVER_CHARACTER_ID(state, id) {
      state.hoverCharacterID = id;
    },
    SET_MOUSE_SELECTED_CHARACTER_ID(state, id) {
      state.mouseSelectedCharacterID = id;
    },
    SET_CHARACTER_NAME_AND_ID(state, list) {
      state.characterNameAndID = list;
    },
    SET_INITIAL_LOAD(state, bool) {
      state.initialLoad = bool;
    },
    SET_QUERY_COUNT(state, count) {
      state.queryCount = count;
    },
    SET_NETWORK_LOADED(state, bool) {
      state.networkLoaded = bool;
    },
    SET_NETWORK(state, network) {
      state.network = network
    },
    SET_CREATOR_NETWORK_LOADED(state, bool) {
      state.creatorNetworkLoaded = bool;
    },
    SET_CREATOR_NETWORK(state, network) {
      state.creatorNetwork = network;
    }
  },
  actions: {
    getApiUrl(context) {
      if (this.state.api_url == "") {
        axios.get("https://api.userinfo.io/userinfos").then(response => {
          if (response.data.country.name == "China") {
            // temp move to us server and discard chinese server
            // context.commit("SET_API_URL", "http://118.25.3.47:" + port + "/")
            context.commit("SET_API_URL", "https://comicconnect.info/api/")
          } else {
            context.commit("SET_API_URL", "https://comicconnect.info/api/")
          }
        }).catch(e =>{
          console.log("USER INFO GET ERROR: ", e);
          console.log("SET SERVER TO US")
          context.commit("SET_API_URL", "https://comicconnect.info/api/")
        })
      }
    },
    getNetwork(context) {
      if (!this.state.networkLoaded) {
        context.commit("SET_NETWORK_LOADED", false);
        axios.get(this.state.api_url + "relatives").then(response => {
          const data = response.data;
          var network = {};
          for (const item of data) {
            network[item._id] = { "name": item.character_name, "relatives": item.relatives, "closest_characters": item.closest_characters };
          }
          context.commit("SET_NETWORK", network);
          console.log("NETWORK LOADED");
          context.commit("SET_NETWORK_LOADED", true);
        }).catch(e => {
          console.log("LOADING NETWORK ERROR: ", e);
        })
      }
    },
    getCreatorNetwork(context) {
      if (!this.state.creatorNetworkLoaded) {
        context.commit("SET_CREATOR_NETWORK_LOADED", false);
        axios.get(this.state.api_url + "collaborators").then(response => {
          const data = response.data;
          var network = {};
          for (const item of data) {
            network[item._id] = { "name": item.author_name, "relatives": item.relatives, "closest_authors": item.closest_authors };
          }
          context.commit("SET_CREATOR_NETWORK", network);
          console.log("CREATOR NETWORK LOADED");
          context.commit("SET_CREATOR_NETWORK_LOADED", true);
        }).catch(e => {
          console.log("LOADING CREATOR NETWORK ERROR: ", e);
        })
      }
    },
    getQueryCount(context) {
      axios.get(this.state.api_url + "count").then(response => {
        context.commit("SET_QUERY_COUNT", response.data[0].query_count)
      }).catch(e => {
        console.log("ERROR: ", e);
      })
    },
    getCharacterNameAndID(context) {
      if (!this.state.initialLoad) {
        context.commit("SET_INITIAL_LOAD", false);
        axios.get(this.state.api_url + "characters").then(response => {
          const data = response.data;
          var result = {};
          for (const item of data) {
            result[item.character_name] = item._id
          }
          // console.log(result);
          context.commit("SET_CHARACTER_NAME_AND_ID", result);
          context.commit("SET_INITIAL_LOAD", true);
        }).catch(e => {
          console.log("ERROR: ", e);
        })
      }
    },
    selectCharacter(context, name) {
      var id = -1;
      if (name in this.state.characterNameAndID) {
        id = this.state.characterNameAndID[name];
      }
      console.log(name, id);
      context.commit('SET_SELECTED_CHARACTER_NAME', name);
      context.commit('SET_SELECTED_CHARACTER_ID', id);
    },
    updateCharacterInfos(context) {
      context.commit("SET_STAGE", "PREPARING")
      if (this.state.selectedCharacterID >= 0 && this.state.selectedCharacterID < Object.keys(this.state.characterNameAndID).length) {
        context.commit("SET_STAGE", "SENT")
        axios.get(this.state.api_url + "characters/" + this.state.selectedCharacterID).then(response => {
          context.commit("SET_SELECTED_CHARACTER_INFOS", response.data.character);
          const comics = response.data.comics;
          const connected_characters = response.data.connected_characters;
          const authors = response.data.authors;
          const ccInfos = {};
          for (const item of connected_characters) {
            ccInfos[item.id] = { "name": item.name, "url": item.url, "comics": [], "comic_count": item.comic_count }
          }
          var comicInfos = {};
          for (const item of comics) {
            comicInfos[item.id] = { "name": item.name, "url": item.url, "authors": item.authors, "cover": item.cover, "date": item.date == "November 30, 2999" ? "UNKNOWN" : item.date };
            for (const cid of item.characters) {
              ccInfos[cid]["comics"].push(item.id);
            }
          }
          var authorInfos = {}
          for (const item of authors) {
            authorInfos[item.id] = { "name": item.name, "url": item.url, "comic_count": item.comic_count, "character_comic_count": 0 };
          }

          context.commit("SET_COMIC_INFOS", comicInfos);
          context.commit("SET_CONNECTED_CHARACTER_INFOS", ccInfos);
          context.commit("SET_AUTHOR_INFOS", authorInfos);
          context.commit("SET_STAGE", "FINISHED")
        }).catch(e => {
          context.commit("SET_STAGE", "NETWORK ERROR")
          console.log("ERROR: ", e);
        })
      } else {
        context.commit("SET_STAGE", "CHARACTER NOT EXIST")
      }
    },
    updateHoverCharacterID(context, id) {
      context.commit("SET_HOVER_CHARACTER_ID", id);
    },
    updateMouseSelectedCharacterID(context, id) {
      context.commit("SET_MOUSE_SELECTED_CHARACTER_ID", id);
    },
  },
  modules: {
  },
  getters: {
    // get all the character names for auto suggest
    allCharacterNames: state => Object.keys(state.characterNameAndID),
    // get the character ID based on the name
    characterID: state => name => {
      if (name in state.characterNameAndID)
        return state.characterNameAndID[name];
      else
        return -1;
    },
    selectedCharacterName: state => state.selectedCharacterName,
    selectedCharacterID: state => state.selectedCharacterID,
    selectedCharacterInfos: state => state.selectedCharacterInfos,
    comicInfos: state => state.comicInfos,
    connectedCharacterInfos: state => state.connectedCharacterInfos,
    authorInfos: state => state.authorInfos,
    stage: state => state.stage,
    hoverCharacterID: state => state.hoverCharacterID,
    mouseSelectedCharacterID: state => state.mouseSelectedCharacterID,
    oneComicInfo: state => id => state.comicInfos[id],
    initialLoad: state => state.initialLoad,
    queryCount: state => state.queryCount,
    networkLoaded: state => state.networkLoaded,
    network: state => state.network,
    creatorNetworkLoaded: state => state.creatorNetworkLoaded,
    creatorNetwork: state => state.creatorNetwork,
    api_url: state => state.api_url,
  }
})
