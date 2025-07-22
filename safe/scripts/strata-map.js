function getPopupCoordinates(feature) {
    if ((feature.geometry.type !== 'Polygon') && (feature.geometry.type !== 'MultiPolygon')) {
        throw new Error('bad feature shape!')
    }
    if (feature.geometry.type === 'Polygon') {
        return turf.centerOfMass(feature.geometry).geometry.coordinates;
    }
    let currLargestIndex = 0
    for (let i = 1; i < feature.geometry.coordinates.length; i += 1) {
        if (turf.area(
                {'type': 'Polygon', 'coordinates': feature.geometry.coordinates[currLargestIndex]}
            ) < turf.area(
                {'type': 'Polygon', 'coordinates': feature.geometry.coordinates[i]}
            )) 
        {
            currLargestIndex = i;
        }
    }
    return turf.centerOfMass(
            {'type': 'Polygon', 'coordinates': feature.geometry.coordinates[currLargestIndex]}
        ).geometry.coordinates;
}

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

    // highlight layer
    map.addLayer({
        id: 'highlight-layer',
        type: 'fill',
        source: 'attributes',
        layout: {},
        paint: {
            'fill-color': '#0C68DF',
            'fill-opacity': 0.4
        },
        filter: ['==', 'name', ''] // Initially empty filter
    });

    console.log('here')

    // Create a popup, but don't add it to the map yet.
    const popup = new maplibregl.Popup({
        closeButton: false,
        closeOnClick: false
    });

    console.log('popup created')

    let currentFeatureCoordinates = undefined;
    map.on('mousemove', 'territory-layer', (e) => {
        console.log('arg to popupshape func:', e.features[0]);
        const coordinates = getPopupCoordinates(e.features[0]);
        // const coordinates = turf.centerOfMass(e.features[0].geometry);
        if (currentFeatureCoordinates !== coordinates) {
            currentFeatureCoordinates = coordinates;

            // Change the cursor style as a UI indicator.
            map.getCanvas().style.cursor = 'pointer';

            console.log('coordinates:', coordinates);
            const description = e.features[0].properties.shapeName;
            console.log('description:', description);

            // Ensure that if the map is zoomed out such that multiple
            // copies of the feature are visible, the popup appears
            // over the copy being pointed to.
            while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
                coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
            }

            // Populate the popup and set its coordinates
            // based on the feature found.
            popup.setLngLat(coordinates).setHTML(description).addTo(map);

            // activate highlight
            map.setFilter('highlight-layer', ['==', 'shapeName', description]);
        }
    });

    map.on('mouseleave', 'territory-layer', () => {
        currentFeatureCoordinates = undefined;
        map.getCanvas().style.cursor = '';
        popup.remove();
        map.setFilter('highlight-layer', ['==', 'shapeName', '']);
    });
});
