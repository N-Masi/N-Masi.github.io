const styleDark = 'https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json';

// Initialize the main map
const map = new maplibregl.Map({
    container: 'map', // Container ID
    style: styleDark, // Map style
    center: [-55.7658, -15.7939], // Temporary center coordinates [lng, lat]
    zoom: 2, // Temporary initial zoom
    doubleClickZoom: false, // Disable double-click zoom
    dragRotate: false, // Optional: Disable drag rotation
});

// Add navigation controls (zoom in/out)
map.addControl(new maplibregl.NavigationControl());

map.resize()
