const styleDark = 'https://basemaps.cartocdn.com/gl/dark-matter-nolabels-gl-style/style.json';

// Initialize the main map with CARTO basemap
const map = new maplibregl.Map({
    container: 'map', // Container ID
    style: styleDark, // Map style
    center: [-55.7658, -15.7939], // Temporary center coordinates [lng, lat]
    zoom: 2, // Temporary initial zoom
    doubleClickZoom: false, // Disable double-click zoom
    dragRotate: false, // Optional: Disable drag rotation

    // the combined below display only one copy of map, but the panning is weird
    // renderWorldCopies: false,
    // continuousWorld: false,
    // noWrap: true
});

// Add navigation controls (zoom in/out)
map.addControl(new maplibregl.NavigationControl());

map.resize()

map.on('load', () => {
    console.log('map loaded!')

    map.addSource('attributes', {
        type: 'geojson',
        data: 'data/territory_region_income.geojson',
    });

    console.log('source added')

    map.addLayer({
        id: 'territory-layer',
        type: 'fill',
        source: 'attributes',
        layout: {},
        paint: {
            'fill-color': 'gray',
            'fill-opacity': 0.7,
            'fill-outline-color': 'white'
        }
    });

    console.log('source visualized')

    // popup guide: https://maplibre.org/maplibre-gl-js/docs/examples/display-a-popup-on-hover/
    // const popup = new maplibregl.Popup({
    //     closeButton: false,
    //     closeOnClick: false
    // });

    // let currentFeatureCoordinates = undefined;
    // map.on('mousemove', 'attributes', (e) => {
    //     const featureCoordinates = e.features[0].geometry.coordinates.toString();
    //     console.log(featureCoordinates)
    //     if (currentFeatureCoordinates !== featureCoordinates) {
    //         currentFeatureCoordinates = featureCoordinates;

    //         // Change the cursor style as a UI indicator.
    //         map.getCanvas().style.cursor = 'pointer';

    //         const coordinates = e.features[0].geometry.coordinates.slice();
    //         const description = e.features[0].properties.description;

    //         // Ensure that if the map is zoomed out such that multiple
    //         // copies of the feature are visible, the popup appears
    //         // over the copy being pointed to.
    //         while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
    //             coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
    //         }

    //         // Populate the popup and set its coordinates
    //         // based on the feature found.
    //         popup.setLngLat(coordinates).setHTML(description).addTo(map);
    //     }
    // });

    // map.on('mouseleave', 'places', () => {
    //     currentFeatureCoordinates = undefined;
    //     map.getCanvas().style.cursor = '';
    //     popup.remove();
    // });
});
