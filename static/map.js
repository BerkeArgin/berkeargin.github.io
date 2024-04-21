// Define constants for configuration
const MAP_CENTER = [46.519653, 6.632273];
const MAP_ZOOM_LEVEL = 10;
const DATA_URL = "/data/michelin_restaurants.geojson";

let currentFilters = {}; // Store current filters globally
let allFeaturesData = []; // Cache all features data

// Initialize and configure the map
const map = initializeMap();

// Set up SVG overlay for data visualization
const { svg, g } = setupSvgOverlay();

// Load and process GeoJSON data
loadAndProcessData(DATA_URL);

// Add toggle panel control
addTogglePanelControl();

// Initialize filter event listeners
initializeFilterControls();

function initializeMap() {
    const tiles = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    });

    const map = L.map('map', {
        zoomControl: false
    }).addLayer(tiles)
      .setView(MAP_CENTER, MAP_ZOOM_LEVEL);

    map.addControl(L.control.zoom({ position: 'bottomleft' }));
    return map;
}

function setupSvgOverlay() {
    const svg = d3.select(map.getPanes().overlayPane).append("svg");
    const g = svg.append("g").attr("class", "leaflet-zoom-hide");
    return { svg, g };
}

function loadAndProcessData(url) {
    d3.json(url).then(collection => {
        allFeaturesData = collection.features; // Cache data
        processFilteredData();
    }).catch(err => console.error("Error loading data: ", err));
}

function processFilteredData() {
    const featuresData = applyFilters(allFeaturesData, currentFilters);
    console.log("Filtered Data:", featuresData);

    // Clear existing map entries
    clearMapEntries();

    const transform = d3.geoTransform({ point: projectPoint });
    const path = d3.geoPath().projection(transform);

    featuresData.forEach(d => generateEntry(d));

    map.on("viewreset", () => resetView(path, featuresData));
    resetView(path, featuresData);
}

function clearMapEntries() {
    // Assuming markers are added to a specific layer or directly to the map
    map.eachLayer(function(layer) {
        if (layer instanceof L.CircleMarker) { // Only remove CircleMarkers, preserving base tiles and other layers
            map.removeLayer(layer);
        }
    });
}

function resetView(path, featuresData) {
    const bounds = path.bounds({type: "FeatureCollection", features: featuresData}),
          topLeft = bounds[0],
          bottomRight = bounds[1];

    g.attr("transform", `translate(${-topLeft[0] + 50}, ${-topLeft[1] + 50})`)
     .selectAll("circle")
     .data(featuresData)
     .join("circle")
     .attr("cx", d => applyLatLngToLayer(d).x)
     .attr("cy", d => applyLatLngToLayer(d).y)
     .attr("r", getRadius);
}

function generateEntry(datapoint) {
    console.log(datapoint.properties.name);
    const latLng = new L.LatLng(datapoint.geometry.coordinates[1], datapoint.geometry.coordinates[0]);
    const marker = L.circleMarker(latLng, {
        radius: getRadius(),
        fillColor: getFillColor(datapoint.properties.Award),
        color: '#000',
        weight: 1,
        opacity: 1,
        fillOpacity: 0.8
    }).addTo(map);

    setupMarkerInteractions(marker, latLng, datapoint);
}

function setupMarkerInteractions(marker, latLng, datapoint) {
    let lastClicked = null;
    marker.on("mouseover", () => marker.setRadius(getRadius() + 5))
          .on("mouseout", () => marker.setRadius(getRadius()))
          .on("click", () => {
              if (lastClicked !== marker) {
                  map.setView(latLng, 14);
                  lastClicked?.closePopup();
                  lastClicked = marker;
                  marker.bindPopup(createPopupContent(datapoint)).openPopup();
              } else {
                  map.setView(MAP_CENTER, MAP_ZOOM_LEVEL);
                  marker.closePopup();
                  lastClicked = null;
              }
          });
}

function createPopupContent(datapoint) {
    return `<h2>${datapoint.properties.Name}</h2>
            <p><strong>Country:</strong> ${datapoint.properties.Country}</p>
            <p><strong>City:</strong> ${datapoint.properties.City}</p>
            <p><strong>Award:</strong> ${datapoint.properties.Award}</p>`;
}

function getFillColor(award) {
    const colors = {
        "Bib Gourmand": "green",
        "1 Star": "blue",
        "2 Stars": "yellow",
        "3 Stars": "red",
        default: "gray"
    };
    return colors[award] || colors.default;
}

function getRadius() {
    return Math.max(5, Math.min(12, 3 + (map.getZoom() - 10)));
}

function projectPoint(x, y) {
    return map.latLngToLayerPoint(new L.LatLng(y, x));
}

function applyLatLngToLayer(d) {
    return projectPoint(d.geometry.coordinates[0], d.geometry.coordinates[1]);
}

function addTogglePanelControl() {
    const toggleButton = document.getElementById('toggle-filter-button');
    if (toggleButton) {
        toggleButton.addEventListener('click', function() {
            toggleFilterPanel();
        });
    }
}

function toggleFilterPanel() {
    const panel = document.getElementById('filter-panel');
    const mapArea = document.getElementById('map');
    const panelWidth = '300px';  // Set the panel width

    if (panel.classList.contains('collapsed')) {
        panel.style.right = '0';
        mapArea.style.width = `calc(100% - ${panelWidth})`;
        document.getElementById('toggle-filter-button').style.right = panelWidth;
        panel.classList.remove('collapsed');
    } else {
        panel.style.right = `-${panelWidth}`;
        mapArea.style.width = '100%';
        document.getElementById('toggle-filter-button').style.right = '0';
        panel.classList.add('collapsed');
    }

    map.invalidateSize();  // Ensure the map adjusts to new dimensions
}

function initializeFilterControls() {
    document.getElementById('apply-filters').addEventListener('click', function() {
        currentFilters = {
            country: document.getElementById('country-input').value || null,
            city: document.getElementById('city-input').value || null,
            name: document.getElementById('name-input').value || null,
            awards: Array.from(document.querySelectorAll('#filter-form input[name="award"]:checked')).map(input => input.value),
            continents: Array.from(document.querySelectorAll('#filter-form input[name="continent"]:checked')).map(input => input.value),
            priceRange: document.getElementById('price-range').value || null,
            cuisineType: document.getElementById('cuisine-type-input').value || null,
            ambiance: document.getElementById('ambiance').value || null
        };
        console.log('Applying filters:', currentFilters);
        processFilteredData(); // Reload data with new filters
    });
}

function applyFilters(data, filters) {
    return data.filter(d => {
        if (filters.country && d.properties.Country !== filters.country) return false;
        if (filters.city && d.properties.City !== filters.city) return false;
        if (filters.name && !d.properties.Name.toLowerCase().includes(filters.name.toLowerCase())) return false;
        if (filters.awards && filters.awards.length > 0 && !filters.awards.includes(d.properties.Award)) return false;
        if (filters.continents && filters.continents.length > 0 && !filters.continents.includes(d.properties.Continent)) return false;
        if (filters.priceRange && d.properties.priceRange !== filters.priceRange) return false;
        if (filters.cuisineType && d.properties.cuisineType !== filters.cuisineType) return false;
        if (filters.ambiance && d.properties.ambiance !== filters.ambiance) return false;
        return true;
    });
}

