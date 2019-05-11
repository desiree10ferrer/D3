// Define SVG area dimensions
var svgwidth = 960;
var svgheight = 600;

// Define the chart's chartmargins as an object
var chartmargin = {
    top: 20,
    right: 40,
    bottom: 60,
    left: 60
  };

  // Define dimensions of the chart area
var chartw = svgwidth - chartmargin.left - chartmargin.right;
var charth = svgheight - chartmargin.top - chartmargin.bottom;

// Select body, append SVG area to it, and set the dimensions
var svg = d3
  .select("#scatter")
  .append("svg")
  .attr("width", svgwidth)
  .attr("height", svgheight);


  var chartGroup = svg.append("g")
  .attr("transform", `translate(${chartmargin.left}, ${chartmargin.top})`);


// Load data csv
d3.csv("data.csv") 
  .then(function(healthrisk) {
  
    console.log(healthrisk);

  healthrisk.forEach(function(data) {
  data.poverty = +data.poverty;
  data.smokes = +data.smokes;
});

var xScale = d3.scaleLinear()
.domain([d3.min(healthrisk,d => d.poverty)/ 1.05,d3.max(healthrisk,d => d.poverty) *1.05] )
.range([0,chartw]);

var yScale = d3.scaleLinear()
.domain([d3.min(healthrisk,d => d.smokes)/ 1.05,d3.max(healthrisk,d => d.smokes) *1.05] )
.range([charth,0]);

 
// X-axis
  var xAxis = d3.axisBottom(xScale);
// Y-axis
  var yAxis = d3.axisLeft(yScale);


chartGroup.append("g")
    .attr("transform", `translate(0, ${charth})`)
    .call(xAxis);
chartGroup.append("g")
    .call(yAxis);

  var circlesGroup = chartGroup.selectAll("circle")
  .data(healthrisk)
  .enter()
  .append("circle")
  .attr("cx", d => xScale(d.poverty))
  .attr("cy", d => yScale(d.smokes))
  .attr("r", "12")
  .attr("fill", "purple")
  .attr("opacity", ".5");
  

var toolTip = d3.tip()
  .attr("class", "tooltip")
  .style("background","lightgrey")
  .offset([80, -60])
  .html(function(d) {
    return (`${d.state}<br>Poverty: ${d.poverty}<br>Smokes: ${d.smokes}`);
  });

chartGroup.call(toolTip);

circlesGroup.on("mouseover", function(data) {
  toolTip.show(data, this);
})
  // onmouseout event
  .on("mouseout", function(data, index) {
    toolTip.hide(data);
  });

  chartGroup.append("text")
  .style("font-size", "10px")
  .style("font-weight", "bold")
  .style("fill", "white")
  .selectAll("tspan")
  .data(healthrisk)
  .enter()
  .append("tspan")
      .attr("x", function(data) {
          return xScale(data.poverty -0.12);
      })
      .attr("y", function(data) {
          return yScale(data.smokes -0.12);
      })
      .text(function(data) {
          return data.abbr
      });


  chartGroup.append("text")
  .attr("transform", "rotate(-90)")
  .attr("y", 0 - chartmargin.left + 40)
  .attr("x", 0 - (charth / 2))
  .attr("dy", "1em")
  .attr("class", "axisText")
  .text("Smokes(%)");

  chartGroup.append("text")
      .attr("transform", `translate(${chartw / 2}, ${charth + chartmargin.top + 30})`)
      .attr("class", "axisText")
      .text("Poverty(%)");
  });