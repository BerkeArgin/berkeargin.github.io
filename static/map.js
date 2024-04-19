var mapboxTiles = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
});

// Initialize the map with zoomControl set to false to remove the default position
var map = L.map('map', {
    zoomControl: false // Disable the default zoom control
}).addLayer(mapboxTiles)
  .setView([46.519653, 6.632273], 10);

// Add a new zoom control in the bottom left corner
map.addControl(L.control.zoom({
    position: 'bottomleft'
}));

var svg = d3.select(map.getPanes().overlayPane).append("svg");
var g = svg.append("g").attr("class", "leaflet-zoom-hide");

function getRadius() {
    var zoom = map.getZoom();
    return Math.max(5, Math.min(12, 3 + (zoom - 10))); // Adjust base and scale factor as needed
}

d3.json("/data/michelin_restaurants.geojson", function(collection) {

    var featuresdata = collection.features;
    console.log(featuresdata);

    var transform = d3.geo.transform({ point: projectPoint });
    var path = d3.geo.path().projection(transform);

    featuresdata.forEach(function(d) {
        generateEntry(d);
    });

    function reset() {

        var bounds = path.bounds(collection),
            topLeft = bounds[0],
            bottomRight = bounds[1];

        g.selectAll("circle")
            .data(featuresdata)
            .attr("transform", function(d) {
                var point = applyLatLngToLayer(d);
                console.log("Reset Circle position:", point);
                return "translate(" + point.x + "," + point.y + ")";
            })
            .attr("r", getRadius());

        svg.attr("width", bottomRight[0] - topLeft[0] + 120)
            .attr("height", bottomRight[1] - topLeft[1] + 120)
            .style("left", topLeft[0] - 50 + "px")
            .style("top", topLeft[1] - 50 + "px");

        g.attr("transform", "translate(" + (-topLeft[0] + 50) + "," + (-topLeft[1] + 50) + ")");
    }

    map.on("viewreset", reset);
    reset();
});

var lastClicked = null; // To store the last clicked marker for toggle behavior

function generateEntry(datapoint) {
    console.log(datapoint.properties.name);

    // Convert GeoJSON point to Leaflet LatLng
    var latLng = new L.LatLng(datapoint.geometry.coordinates[1], datapoint.geometry.coordinates[0]);

    // Create a Leaflet circle marker and add it to the map
    var marker = L.circleMarker(latLng, {
        radius: getRadius(),
        fillColor: getFillColor(datapoint.properties.Award),
        color: '#000',
        weight: 1,
        opacity: 1,
        fillOpacity: 0.8
    }).addTo(map);

    marker.on("mouseover", function() {
        this.setRadius(getRadius() + 5); // Increase the radius when hovered
    }).on("mouseout", function() {
        this.setRadius(getRadius()); // Reset the radius to initial based on zoom level
    }).on("click", function() {
        // Toggle behavior
        if (lastClicked !== this) {
            map.setView(latLng, 14); // Focus map on marker's location
            if (lastClicked) {
                lastClicked.closePopup(); // Close the previous popup if one was open
            }
            lastClicked = this;
            // Content for the popup
            var info = "<h2>" + datapoint.properties.Name + "</h2>" +
                       "<p><strong>Country:</strong> " + datapoint.properties.Country + "</p>" +
                       "<p><strong>City:</strong> " + datapoint.properties.City + "</p>" +
                       "<p><strong>Award:</strong> " + datapoint.properties.Award + "</p>";
            this.bindPopup(info).openPopup();
        } else {
            map.setView(latLng, 10); // Reset view to broader map
            this.closePopup(); // Close the popup
            lastClicked = null;
        }
    });

    function getFillColor(award) {
        switch(award) {
            case "Bib Gourmand": return "green";
            case "1 Star": return "blue";
            case "2 Stars": return "yellow";
            case "3 Stars": return "red";
            default: return "gray"; // Default color for unrecognized or missing awards
        }
    }
}

function getRadius() {
    var zoom = map.getZoom();
    return Math.max(5, Math.min(12, 3 + (zoom - 10))); // Scale the circle radius based on zoom level
}


function projectPoint(x, y) {
    var point = map.latLngToLayerPoint(new L.LatLng(y, x));
    this.stream.point(point.x, point.y);
}

function applyLatLngToLayer(d) {
    var y = d.geometry.coordinates[1]
    var x = d.geometry.coordinates[0]
    return map.latLngToLayerPoint(new L.LatLng(y, x))
}



    