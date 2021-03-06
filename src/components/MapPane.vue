<template>
            <div style="height: 40em; width: 100%"
                 v-bind:class="{ fill_space: maximise, 'mt-2': !maximise}">
              <l-map
                  ref="map"
                  v-if="showMap"
                  :zoom="zoom"
                  :center="center"
                  :options="mapOptions"
                  style="height: 100%;"
                  @click="(event) => {$emit('onMapClick', event)}"
                  @update:center="centerUpdate"
                  @update:zoom="zoomUpdate"
                  :worldCopyJump=true
                  :minZoom="2"
              >
                <l-tile-layer
                    :url="url"
                    :attribution="attribution"
                />

                <l-marker v-for="marker in markers"
                          :key="marker.id"
                          :visible="marker.visible"
                          :lat-lng="marker.position"
                          :icon="marker.icon"
                          :draggable=marker.draggable
                          @click="markerSelected(marker)"
                          @dragend="editMarker($event, marker)"
                >
                  <l-tooltip id="popUp"
                             v-if="marker.title != null"
                             :options='{ interactive: true, offset: [2, -36], direction: "top"}'
                  >
                      <div class="container">
                      <b>
                        {{marker.title}} - ${{marker.content}}
                      </b>
                      <span v-if="marker.content">
                                                <hr style="margin: 0.25em">
                                                <span>{{marker.content.startTime}}</span>
                                            </span>
                      </div>
                  </l-tooltip>
                </l-marker>
              </l-map>
            </div>

            <!-- Footer Slot -->
</template>

<script>
  import L from "leaflet";
  import {LMap, LTileLayer, LMarker, LTooltip} from "vue2-leaflet";
  import axios from "axios";

  export default {
    name: "MapPane",
    components: {
      LMap,
      LTileLayer,
      LMarker,
      LTooltip,
    },
    props: {
      canHide: {
        type: Boolean,
        default: true
      },
      title: {
        type: String,
        default: "Map"
      },
      displayCircle: {
        type: Boolean,
        default: false
      },
      maximise: {
        type: Boolean,
        default: false
      },
      pathOverlay: {
        type: Boolean,
        default: false
      }
    },
    data() {
      //Sets up the icons
      const blueMarker = L.icon({
        iconUrl: require('leaflet/dist/images/marker-icon.png'),
        shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
        iconRetinaUrl: require('leaflet/dist/images/marker-icon.png'),
        iconAnchor: [10, 30],
      });
      const redMarker = L.icon({
        iconUrl: require('@/assets/red-marker-icon.png'),
        shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
        iconRetinaUrl: require('@/assets/red-marker-icon.png'),
        iconAnchor: [10, 30],
      });
      const pathMarker = L.icon({
        iconUrl: require('@/assets/path-marker.png'),
        iconRetinaUrl: require('@/assets/path-marker.png'),
        iconAnchor: [8, 8],
      });
      const pathStartMarker = L.icon({
        iconUrl: require('@/assets/path-start-marker.png'),
        iconRetinaUrl: require('@/assets/path-start-marker.png'),
        iconAnchor: [10, 30],
      });
      const pathEndMarker = L.icon({
        iconUrl: require('@/assets/path-end-marker.png'),
        iconRetinaUrl: require('@/assets/path-end-marker.png'),
        iconAnchor: [10, 30],
      });
      return {
        showMap: true,
        zoom: 5,
        center: L.latLng(-43.530629, 172.625955),
        url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
        attribution:
            '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors',
        mapOptions: {
          zoomSnap: 0.5,
          scrollWheelZoom: true
        },
        markers: [],
        blueMarker: blueMarker,
        redMarker: redMarker,
        pathMarker: pathMarker,
        pathStartMarker: pathStartMarker,
        pathEndMarker: pathEndMarker,

        userGeoLocation: null,
        circle: {
          center: [-43.530629, 172.625955],
          radius: 4500,
          color: '#3388ff',
        },
        routePoints: [],
        markerObjects: {},
        savedMarkers: null
      };
    },
    methods: {
      /**
       * Updates the zoom of the map
       **/
      zoomUpdate(zoom) {
        this.zoom = zoom
      },
      updateCircle(lat, lng, radius) {
        this.circle.center = [lat, lng];
        this.circle.radius = radius;
      },
      /**
       * Updates the center of the map
       **/
      centerUpdate(center) {
        this.center = center
      },
      /**
       * Updates the center of the map using lat and lng
       **/
      setMapCenter(lat, lng) {
        this.centerUpdate(L.latLng(lat, lng));
      },
      /**
       * Creates a marker on the map.
       * id: The way the marker is deleted
       * iconColour: used as a key for what icon to display. red = 1, pathMarker = 3, blue = other
       * lat: latitude of the marker
       * lng: longitude of the marker
       * content: content of the tooltip
       * title: title of the tooltip
       *
       * e.g. createMarker(1, -43.630629, 172.625955) will be a red marker at those coordinates
       **/
      createMarker(id, iconColour, lat, lng, content, title, draggable) {
        //Check inputs and set position and icon
        let icon = null;
        let coordinates = [lat, lng];
        if (iconColour === 1) {
          icon = this.redMarker;
        }
        if (iconColour === 3) {
          icon = this.pathStartMarker
        } else {
          icon = this.blueMarker
        }
        if (content == null) {
          content = ""
        }
        if (draggable == null) {
          draggable = false
        }

        //Adds the marker to the markers list to be displayed
        this.markers.push({
          id: id,
          position: coordinates,
          visible: true,
          icon: icon,
          content: content,
          title: title,
          draggable: draggable
        })
      },
      /**
       * Gets latest marker that the user has inputted
       *
       **/
      getLatestMarker() {
        return this.markers[this.markers.length - 1]
      },

      /**
       * Gets latest marker that the user has inputted
       *
       **/
      revertMarkers() {
        const oldCoordinates = this.savedMarkers[0]
        const index = this.savedMarkers[1]
        this.markers[index].position = oldCoordinates
        this.savedMarkers = null
      },

      /**
       * Sets latest markers icon color to blue
       *
       **/
      updateStartFinishMarkers() {
        if (this.markers.length === 2) {
          this.markers[0].icon = this.pathStartMarker
          this.markers[1].icon = this.pathEndMarker
        }
        if (this.markers.length > 2) {
          this.markers[this.markers.length - 2].icon = this.blueMarker
          this.markers[this.markers.length - 1].icon = this.pathEndMarker
        }
      },

      /**
       * Returns all markers longitude and latitude in a list
       *
       **/
      getAllMarkersCoords() {
        let coords = []
        for (let marker of this.markers) {
          coords.push([marker.position[1], marker.position[0]])
        }
        return coords
      },
      /**
       * Sets route points with given parameter
       *
       **/
      setRoutePoints(routePoints) {
        this.routePoints = routePoints
      },

      /**
       * Sets route points with given parameter
       *
       **/
      editSingleRoutePoint(point, index) {
        this.routePoints[index] = point
      },

      /**
       * Sets Route points using path
       **/
      setPath(path, show_keypoints = false, only_start_finish = false) {
        if (path === null) {
          this.routePoints = [];
          return;
        }

        // Set markers
        if (show_keypoints) {
          for (let i = 0; i < path.locations.length; i++) {
            let keypoint = path.locations[i];

            // Set Colour
            let colour_id = 2;
            if (i === 0) {
              colour_id = 3;
            }

            // Title
            let title = null;
            if (i === 0) {
              title = "Start";
            }
            if (i === path.locations.length - 1) {
              title = "Finish";
            }

            if (!only_start_finish || (only_start_finish && (i === 0 || i === path.locations.length
                - 1))) {
              this.createMarker(i, colour_id, keypoint.latitude, keypoint.longitude,
                  "", title, false);
            }
          }
          this.getLatestMarker().icon = this.pathEndMarker;
        }

        if (path.type === "STRAIGHT") {
          // Create api route path from path locations
          this.routePoints = [];
          for (const keypoint of path.locations) {
            this.routePoints.push([keypoint.latitude, keypoint.longitude]);
          }
        } else if (path.type === "DEFINED") {
          // Create api keypoints from path locations
          let keypoints = [];
          for (const keypoint of path.locations) {
            keypoints.push([keypoint.longitude, keypoint.latitude]);
          }

          // Get direction route using keypoints
          axios.post("https://api.openrouteservice.org/v2/directions/foot-hiking/geojson",
              {
                coordinates: keypoints,
              },
              {headers: {Authorization: "5b3ce3597851110001cf6248183abbef295f42049b13e7a011f98247"}})
              .then((res) => {
                // Load route points from api data
                this.routePoints = [];
                for (let location of res.data.features[0].geometry.coordinates) {
                  this.routePoints.push([location[1], location[0]])
                }
              }).catch((err) => {
            console.error(err);
          });
        }
      },

      /**
       * Sets markers with given parameter
       *
       **/
      setMarkers(markers) {
        this.markers = markers
      },

      /**
       * Removes a marker by id
       **/
      removeMarker(id) {
        if (this.markers.length < 1) {
          return false;
        }
        let i = 0;
        let marker;
        //Loops over markers and removes a marker with the same id
        for (marker of this.markers) {
          if (marker.id === id) {
            this.markers.splice(i);
            return true
          }
          i += 1
        }
        return false
      },

      /**
       * Clear all markers
       **/
      clearMarkers() {
        this.markers = [];
      },

      /**
       * Updates the map's viewing size when map container size changes. For instance
       * in a tab.
       **/
      refreshMap() {
        let map = this.$refs.map;
        setTimeout(function () {
          map.mapObject.invalidateSize();
        }, 100);
      },

      /**
       * If no markers are available, the map centers on the currently logged in users geo location
       **/
      updateMapToUserGeoLocation() {
        let _this = this;
        navigator.geolocation.getCurrentPosition((pos) => {
          _this.userGeoLocation = {
            lat: pos.coords.latitude,
            lng: pos.coords.longitude
          };
          _this.$emit('userLocationUpdate', _this.userGeoLocation);
          _this.setMapCenter(pos.coords.latitude, pos.coords.longitude)
            console.log(pos.coords.latitude)
            alert(pos.coords.longitude)
        });
      },

      /**
       * Focuses the map to the marker selected
       **/
      markerSelected(marker) {
        this.$emit('markerSelected', marker.id);
        if (this.routePoints.length === 0) {
          this.center = marker.position;
        } else {
          this.$parent.clickOnMarker(marker.position)
        }
      },

      /**
       * Called when user drags a marker, gets the new coordinate location and the old previous
       * location then updates the route and markers
       **/
      editMarker(event, marker) {
        const newCoords = Object.values(event.target.getLatLng())
        let index
        for (let i = this.markers.length - 1; i >= 0; i--) {
          if (this.markers[i].position === marker.position) {
            index = i
          }
        }
        this.savedMarkers = [this.markers[index].position, index]
        this.markers[index].position = newCoords
        this.$parent.handleDragEvent(index, newCoords)
      },
    },

    /**
     * Refresh the map everytime the map is rendered by vue.
     */
    updated: function () {
      this.$nextTick(function () {
        // Code that will run only after the
        // entire view has been re-rendered
        this.refreshMap();
      })
    },
    mounted() {
      this.updateMapToUserGeoLocation();
    }
  };
</script>
<style>
  .control-overlay {
    background: #fff;
    padding: 0 0.5em;
    border: 1px solid #aaa;
    border-radius: 0.1em;
    opacity: 80%;
    padding: 0.5em;
    margin: 0.5em;
  }

  .fill_space {
    width: 100% !important;
    height: 100% !important;
    margin: 0 !important;
    padding: 0 !important;
  }

</style>