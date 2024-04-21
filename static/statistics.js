// statistics.js

document.addEventListener("DOMContentLoaded", function() {
    initVerticalChart();
    initHorizontalChart();
});

function initVerticalChart() {
    const data = [
        {"Continent": "Asia", "Listings": 1894},
        {"Continent": "Europe", "Listings": 4178},
        {"Continent": "North America", "Listings": 661},
        {"Continent": "South America", "Listings": 61}
    ];

    const margin = { top: 30, right: 30, bottom: 70, left: 60 },
          width = 460 - margin.left - margin.right,
          height = 400 - margin.top - margin.bottom;

    const svg = d3.select("#chart")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);

    setupVerticalChartAxes(svg, data, width, height);
    addVerticalChartBars(svg, data, width, height);
}

function setupVerticalChartAxes(svg, data, width, height) {
    const x = d3.scaleBand()
        .range([0, width])
        .domain(data.map(d => d.Continent))
        .padding(0.2);

    svg.append("g")
        .attr("transform", `translate(0,${height})`)
        .call(d3.axisBottom(x));

    const y = d3.scaleLinear()
        .domain([0, 4500])
        .range([height, 0]);

    svg.append("g")
        .call(d3.axisLeft(y));

    svg.append("g")
        .attr("class", "grid")
        .call(d3.axisLeft(y).ticks(5).tickSize(-width).tickFormat(""));
}

function addVerticalChartBars(svg, data, width, height) {
    const y = d3.scaleLinear().domain([0, 4500]).range([height, 0]);
    const colorScale = d3.scaleOrdinal(d3.schemeCategory10);
    const tooltip = setupTooltip();

    svg.selectAll(".bar")
        .data(data)
        .enter().append("rect")
        .attr("class", "bar")
        .attr("x", d => d3.scaleBand().range([0, width]).domain(data.map(d => d.Continent))(d.Continent))
        .attr("width", d3.scaleBand().range([0, width]).domain(data.map(d => d.Continent)).padding(0.2).bandwidth())
        .attr("fill", d => colorScale(d.Continent))
        .attr("y", d => y(0))
        .attr("height", 0)
        .on("mouseover", (event, d) => showTooltip(event, tooltip, `Continent: ${d.Continent}<br/>Listings: ${d.Listings}`))
        .on("mouseout", () => hideTooltip(tooltip))
        .transition()
        .duration(800)
        .attr("y", d => y(d.Listings))
        .attr("height", d => height - y(d.Listings));
}

function setupTooltip() {
    return d3.select("body").append("div")
        .attr("class", "tooltip")
        .style("opacity", 0);
}

function showTooltip(event, tooltip, htmlContent) {
    tooltip.transition()
        .duration(200)
        .style("opacity", .9);
    tooltip.html(htmlContent)
        .style("left", (event.pageX + 10) + "px")
        .style("top", (event.pageY - 28) + "px");
}

function hideTooltip(tooltip) {
    tooltip.transition()
        .duration(500)
        .style("opacity", 0);
}

function initHorizontalChart() {
    const dataHorizontal = [
        {"City": "France", "Listings": 1016, "Continent": "Europe"},
        {"City": "Japan", "Listings": 733, "Continent": "Asia"},
        {"City": "Italy", "Listings": 651, "Continent": "Europe"},
        {"City": "USA", "Listings": 600, "Continent": "North America"},
        {"City": "Germany", "Listings": 581, "Continent": "Europe"},
        {"City": "Spain", "Listings": 500, "Continent": "Europe"},
        {"City": "United Kingdom", "Listings": 275, "Continent": "Europe"},
        {"City": "Belgium", "Listings": 270, "Continent": "Europe"},
        {"City": "Switzerland", "Listings": 257, "Continent": "Europe"},
        {"City": "China Mainland", "Listings": 242, "Continent": "Asia"},
        {"City": "Thailand", "Listings": 231, "Continent": "Asia"},
        {"City": "Netherlands", "Listings": 219, "Continent": "Europe"},
        {"City": "Taiwan", "Listings": 182, "Continent": "Asia"},
        {"City": "Hong Kong SAR China", "Listings": 139, "Continent": "Asia"},
        {"City": "Singapore", "Listings": 132, "Continent": "Asia"},
        {"City": "South Korea", "Listings": 89, "Continent": "Asia"},
        {"City": "Portugal", "Listings": 73, "Continent": "Europe"},
        {"City": "Canada", "Listings": 61, "Continent": "North America"},
        {"City": "Malaysia", "Listings": 50, "Continent": "Asia"},
        {"City": "Brazil", "Listings": 47, "Continent": "South America"},
        {"City": "Denmark", "Listings": 47, "Continent": "Europe"},
        {"City": "United Arab Emirates", "Listings": 41, "Continent": "Asia"},
        {"City": "Türkiye", "Listings": 38, "Continent": "Europe"},
        {"City": "Vietnam", "Listings": 33, "Continent": "Asia"},
        {"City": "Ireland", "Listings": 33, "Continent": "Europe"},
        {"City": "Sweden", "Listings": 29, "Continent": "Europe"},
        {"City": "Austria", "Listings": 25, "Continent": "Europe"},
        {"City": "Croatia", "Listings": 25, "Continent": "Europe"},
        {"City": "Macau SAR China", "Listings": 22, "Continent": "Asia"},
        {"City": "Norway", "Listings": 21, "Continent": "Europe"},
        {"City": "Greece", "Listings": 17, "Continent": "Europe"},
        {"City": "Slovenia", "Listings": 16, "Continent": "Europe"},
        {"City": "Luxembourg", "Listings": 16, "Continent": "Europe"},
        {"City": "Hungary", "Listings": 15, "Continent": "Europe"},
        {"City": "Argentina", "Listings": 14, "Continent": "South America"},
        {"City": "Poland", "Listings": 10, "Continent": "Europe"},
        {"City": "Malta", "Listings": 10, "Continent": "Europe"},
        {"City": "Finland", "Listings": 9, "Continent": "Europe"},
        {"City": "Estonia", "Listings": 8, "Continent": "Europe"},
        {"City": "Czech Republic", "Listings": 7, "Continent": "Europe"},
        {"City": "Latvia", "Listings": 4, "Continent": "Europe"},
        {"City": "Iceland", "Listings": 3, "Continent": "Europe"},
        {"City": "Serbia", "Listings": 2, "Continent": "Europe"},
        {"City": "Andorra", "Listings": 1, "Continent": "Europe"}
    ];

    let activeContinents = new Set();

    const margin = {top: 20, right: 30, bottom: 40, left: 180},
        width = 960 - margin.left - margin.right,
        height = 500 - margin.top - margin.bottom;

    const svg = d3.select("#horizontal-chart")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);

    const x = d3.scaleLinear()
        .range([0, width]);

    const y = d3.scaleBand()
        .padding(0.1)
        .range([0, height]);

    const color = d3.scaleOrdinal(d3.schemeCategory10);

    const tooltip = d3.select("body").append("div")
        .attr("class", "tooltip");

    function updateChart() {
        let filteredData = activeContinents.size === 0 ? dataHorizontal :
            dataHorizontal.filter(d => activeContinents.has(d.Continent));
        filteredData = filteredData.sort((a, b) => b.Listings - a.Listings).slice(0, 10);

        x.domain([0, d3.max(filteredData, d => d.Listings)]);
        y.domain(filteredData.map(d => d.City));

        svg.selectAll(".bar").remove();
        svg.selectAll(".axis").remove();

        svg.append("g")
            .attr("class", "axis axis--y")
            .call(d3.axisLeft(y));

        svg.append("g")
            .attr("class", "axis axis--x")
            .attr("transform", "translate(0," + height + ")")
            .call(d3.axisBottom(x));

        svg.selectAll(".bar")
            .data(filteredData)
            .enter().append("rect")
            .attr("class", "bar")
            .attr("y", d => y(d.City))
            .attr("height", y.bandwidth())
            .attr("x", 0)
            .attr("width", d => x(d.Listings))
            .attr("fill", (d, i) => color(i))
            .on("mouseover", function(event, d) {
                tooltip.transition().duration(200).style("opacity", .9);
                tooltip.html(d.City + ": " + d.Listings)
                    .style("left", (event.pageX + 5) + "px")
                    .style("top", (event.pageY - 28) + "px");
            })
            .on("mouseout", function(d) {
                tooltip.transition().duration(500).style("opacity", 0);
            });
    }

    document.querySelectorAll(".filter-btn").forEach(btn => {
        btn.addEventListener("click", function() {
            const continent = this.dataset.continent;
            if (continent === "All") {
                activeContinents.clear();
                document.querySelectorAll(".filter-btn").forEach(b => b.classList.remove("selected"));
            } else {
                if (activeContinents.has(continent)) {
                    activeContinents.delete(continent);
                    this.classList.remove("selected");
                } else {
                    activeContinents.add(continent);
                    this.classList.add("selected");
                }
            }
            updateChart();
        });
    });

    updateChart();  // Initialize the chart
}