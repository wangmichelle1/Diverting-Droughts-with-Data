function openTab(evt, tabName) {
  // Declare all variables
  let i, tabcontent, tablinks;

  // Get all elements with class="tabcontent" and hide them
  tabcontent = document.getElementsByClassName("tabcontent");
  for (i = 0; i < tabcontent.length; i++) {
    tabcontent[i].style.display = "none";
  }

  // Get all elements with class="tablinks" and remove the class "active"
  tablinks = document.getElementsByClassName("tablinks");
  for (i = 0; i < tablinks.length; i++) {
    tablinks[i].className = tablinks[i].className.replace(" active", "");
  }

  // Show the current tab, and add an "active" class to the button that opened the tab
  document.getElementById(tabName).style.display = "block";
  evt.currentTarget.className += " active";
}

// Get the element with id="defaultOpen" and click on it
document.getElementById("defaultOpen").click();

// Function that allows user to filter data by year through drop down menus
function updateYear (menuId) {
    // retrieve the year chosen by the user from the drop down menu
    let yearMenu = document.getElementById(menuId);
    let selected_year = yearMenu.options[yearMenu.selectedIndex].text;
    return selected_year;
}

// Set frame dimensions for visualizations
const FRAME_HEIGHT = 500;
const FRAME_WIDTH = 500; 

// Set margins for visualizations
const MARGINS = {left: 50, right: 50, top: 50, bottom: 50};

// Set vis dimensions for visualizations
const VIS_HEIGHT = FRAME_HEIGHT - MARGINS.top - MARGINS.bottom;
const VIS_WIDTH = FRAME_WIDTH - MARGINS.left - MARGINS.right; 

// Create frame for the line chart above the map
const FRAME1 = d3.select("#line")
                 .append("svg")
                 .attr("height", FRAME_HEIGHT)
                 .attr("width", FRAME_WIDTH)
                 .attr("class", "frame"); 

// Create frame for scatterplot above the map
const FRAME2 = d3.select("#scatter")
                 .append("svg")
                 .attr("height", FRAME_HEIGHT)
                 .attr("width", FRAME_WIDTH)
                 .attr("class", "frame");

// Create frame for map
const FRAME3 = d3.select("#map")
                 .append("svg")
                 .attr("height", FRAME_HEIGHT)
                 .attr("width", FRAME_WIDTH)
                 .attr("class", "frame"); 

// Create frame for bar for linking
const FRAME4 = d3.select("#link1")
                   .append("svg")
                   .attr("height", FRAME_HEIGHT + 30)
                   .attr("width", FRAME_WIDTH)
                   .attr("class", "frame"); 

// Create frame for scatter for linking
const FRAME5 = d3.select("#link2")
                   .append("svg")
                   .attr("height", FRAME_HEIGHT + 30)
                   .attr("width", FRAME_WIDTH)
                   .attr("class", "frame");  

// Set up map showing drought severities across regions in Massachusetts

d3.json("data/massachusetts.geojson").then((massmap) => {    
  let map = L.map("map", {
    // Set min and max zoom
    minZoom: 7,
    maxZoom: 9
  });

  // Using setInterval to refresh map to get it centered
  setInterval(function() {
     map.invalidateSize();
  }, 1);
  
  // add the map of Massachusetts based on latitudinal and longitudinal data
  map.createPane("labels");
  map.getPane("labels").style.zIndex = 500;
  map.getPane("labels").style.pointerEvents = "none";

  let positron = L.tileLayer("https://{s}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}.png", {
      attribution: "©OpenStreetMap, ©CartoDB"
  }).addTo(map);

  let positronLabels = L.tileLayer("https://{s}.basemaps.cartocdn.com/light_only_labels/{z}/{x}/{y}.png", {
       attribution: "©OpenStreetMap, ©CartoDB",
       pane: "labels"
  }).addTo(map);

  let geojson = L.geoJson(massmap.features).addTo(map);

  geojson.eachLayer(function (layer) {
    layer.bindPopup(layer.feature.properties.name);
  });

  setTimeout(function(){ map.invalidateSize()}, 300);
  map.fitBounds(geojson.getBounds());

  // Create icon markers for different regions

  // Add markers for the main counties in each region 
  let berkshire = L.marker([42.3118, -73.1822]).addTo(map).bindPopup("Berkshire County").openPopup();
  let franklin = L.marker([42.587334, -72.603416]).addTo(map).bindPopup("Franklin County").openPopup();
  let hampshire = L.marker([42.3471, -72.6624]).addTo(map).bindPopup("Hampshire County").openPopup();
  let hampden = L.marker([42.1172, -72.6624]).addTo(map).bindPopup("Hampden County").openPopup();
  let worcester = L.marker([42.2714, -71.7989]).addTo(map).bindPopup("Worcester County").openPopup();
  let essex = L.marker([42.7051, -70.9071]).addTo(map).bindPopup("Essex County").openPopup();
  let middlesex = L.marker([42.4672, -71.2874]).addTo(map).bindPopup("Middlesex County").openPopup();
  let suffolk = L.marker([42.3577, -70.9785]).addTo(map).bindPopup("Suffolk County").openPopup();
  let norfolk = L.marker([42.1767, -71.1449]).addTo(map).bindPopup("Norfolk County").openPopup();
  let bristol = L.marker([41.7938, -71.1449]).addTo(map).bindPopup("Bristol County").openPopup();
  let plymouth = L.marker([41.9120, -70.7168]).addTo(map).bindPopup("Plymouth County").openPopup();
  let barnstable = L.marker([41.6500, -70.3450]).addTo(map).bindPopup("Barnstable County").openPopup();
  let dukes = L.marker([41.4040, -70.6693]).addTo(map).bindPopup("Dukes County").openPopup();
  let nantucket = L.marker([41.2835, -70.0995]).addTo(map).bindPopup("Nantucket County").openPopup();
  
  // hide all the popups when the page initially loads
  map.closePopup();

  // Add class attribute to marker based on its located region
  berkshire._icon.classList.add("western");
  franklin._icon.classList.add("conn-river");
  hampshire._icon.classList.add("conn-river");
  hampden._icon.classList.add("conn-river");
  worcester._icon.classList.add("central");
  essex._icon.classList.add("northeast");
  middlesex._icon.classList.add("northeast");
  suffolk._icon.classList.add("northeast");
  bristol._icon.classList.add("southeast");
  plymouth._icon.classList.add("southeast");
  norfolk._icon.classList.add("southeast");
  barnstable._icon.classList.add("cape-cod");
  dukes._icon.classList.add("cape-cod");
  nantucket._icon.classList.add("cape-cod");
});


// Parse the precipitation pattern data
d3.csv("data/precipitation_cleaned.csv").then((precipitation) => {
  // Read into dataset and print data
  console.log(precipitation);

  // Parse the combined precipitation and standard precipitation index data
  d3.csv("data/combined_prep_spi.csv").then((combined) => {
    // Read into dataset and print data
    console.log(combined);

    // Create a legend used for multiple plots
    const LEGEND = d3.selectAll(".legend")
                      .append("svg")
                      .attr("height", FRAME_HEIGHT/3)
                      .attr("width", FRAME_WIDTH/2);

    // Points for the legend
    LEGEND.append("circle").attr("cx",10).attr("cy",50).attr("r", 6).style("fill", "#1974d2").attr("class", "mark");
    LEGEND.append("circle").attr("cx",10).attr("cy",70).attr("r", 6).style("fill", "#2e8b57").attr("class", "mark");
    LEGEND.append("circle").attr("cx",10).attr("cy",90).attr("r", 6).style("fill", "#CC5500").attr("class", "mark");
    LEGEND.append("circle").attr("cx",10).attr("cy",110).attr("r", 6).style("fill", "#a17100").attr("class", "mark");
    LEGEND.append("circle").attr("cx",10).attr("cy",130).attr("r", 6).style("fill", "#ff66cc").attr("class", "mark");
    LEGEND.append("circle").attr("cx",10).attr("cy",150).attr("r", 6).style("fill", "#9370db").attr("class", "mark");

    // Text for the legend
    LEGEND.append("text").attr("x", 20).attr("y", 55).text("Cape Cod and Islands").style("font-size", "15px").style("fill", "black");
    LEGEND.append("text").attr("x", 20).attr("y", 75).text("Central").style("font-size", "15px").style("fill", "black");
    LEGEND.append("text").attr("x", 20).attr("y", 95).text("Connecticut River").style("font-size", "15px").style("fill", "black");
    LEGEND.append("text").attr("x", 20).attr("y", 115).text("Northeast").style("font-size", "15px").style("fill", "black");
    LEGEND.append("text").attr("x", 20).attr("y", 135).text("Southeast").style("font-size", "15px").style("fill", "black");
    LEGEND.append("text").attr("x", 20).attr("y", 155).text("Western").style("font-size", "15px").style("fill", "black");

    // Set up precipitation line chart

    // Find max precipitation (y) value
    const MAX_PRECIP = d3.max(precipitation, (d) => { return parseFloat(d.Precipitation); });

    // Scale the months for the x-axis
    const MONTH_SCALE = d3.scaleBand()
                          .range([0, VIS_WIDTH])
                          .domain(precipitation.map((d) => { return d.Month; }))
                          .padding(0.2);

    // Scale the precipitation values for the y-axis
    const PRECIP_SCALE1 = d3.scaleLinear()
                            .domain([0, (MAX_PRECIP + 1)]) // add some padding
                            .range([VIS_HEIGHT, 0]);

    // Add X axis  
    const xAxis1 = FRAME1.append("g") 
                .attr("transform", "translate(" + MARGINS.left + "," + (VIS_HEIGHT + MARGINS.top) + ")") 
                .call(d3.axisBottom(MONTH_SCALE)) 
                .attr("font-size", "10px")
                .attr("class", "x axis")
                .selectAll("text")
                  .attr("transform", "translate(10, 0)")
                  .style("text-anchor", "end");

    // Add Y axis
    const yAxis1 = FRAME1.append("g")       
                .attr("transform", "translate(" + MARGINS.left + "," + MARGINS.bottom + ")")
                .call(d3.axisLeft(PRECIP_SCALE1).ticks(20))
                .attr("font-size", "10px")
                .attr("class", "y axis");

    // Label the x axis
    FRAME1.append("text")
      .attr("x", MARGINS.left + VIS_WIDTH/2)
      .attr("y", VIS_HEIGHT + 90)
      .text("Month")
      .attr("class", "axes");
        
    // Label the y axis 
    FRAME1.append("text")
      // .attr("text-anchor", "middle")
      .attr("x", 0 - VIS_HEIGHT/2 - MARGINS.top)
      .attr("y", 15)
      .attr("transform", "rotate(-90)")
      .text("Precipitation (inches)")
      .attr("class", "axes");
    
    // Set color of the points based on region
    const REGION_COLOR = d3.scaleOrdinal()
      .domain(["Cape Cod and Islands", "Central", "Connecticut River", "Northeast", "Southeast", "Western"])
      .range(["#1974d2", "#2e8b57", "#CC5500", "#a17100", "#ff66cc", "#9370db"]);

      
    // Filter plot by selected year(s)
    // Drop down menu by year for users 
    let yearOptions = "";
    for(let i=1838; i<=2019 ; i++) yearOptions += `<option>${i}</option>`;
    document.querySelector("[name=check]").innerHTML = yearOptions;

    // Intialize and array that contains the regions represented in the plots above the map
    let shown_regions = [];

    // Filter plot by selected region(s)
    d3.selectAll(".region-button").on("change", function () {
      // retrieve the region associated with the checked/unchecked box
      let selected_region = this.value, 
      // determine whether the box is checked or unchecked
      display = this.checked ? region_display = "inline" : region_display = "none";

      // store the data for regions associated with checked boxes
      if (region_display == "inline" && shown_regions.includes(selected_region) == false){
        shown_regions.push(selected_region);
      // not plotting data for regions associated with unchecked boxes
      } else if (region_display == "none" && shown_regions.includes(selected_region)){
          region_index = shown_regions.indexOf(selected_region);
          shown_regions.splice(region_index, 1);
      };
    });

    // Update the line chart to reflect user-specified input each time a button is clicked
    d3.select("#btn1").on("click", function() {

      // reset the plot so that no lines or points appear
      FRAME1.selectAll(".dottedline")
            .attr("display", "none");

      FRAME1.selectAll(".mark")
            .attr("display", "none");

      // retrieve the year selected by the user in the drop down menu for the line chart
      let selected_year1 = updateYear("selectYear1");

      // Show data pertaining to regions with checked boxes and the year chosen in the drop down menu
      for (let j = 0; j < shown_regions.length; j++) {
        let lineChartFilter = precipitation.filter(function(d) {return d.Region == shown_regions[j]; })
                                           .filter(function(d) { return d.YEAR == selected_year1; });

      // Plot points on plot
      const myPoint1 = FRAME1.append("g")
                           .selectAll("points")  
                           .data(lineChartFilter)  
                           .enter()       
                           .append("circle")  
                           .attr("cx", (d) => { return (MONTH_SCALE(d.Month) + MARGINS.left); }) 
                           .attr("cy", (d) => { return (PRECIP_SCALE1(d.Precipitation) + MARGINS.top); }) 
                           .attr("r", 5)
                           .attr("fill", (d) => { return REGION_COLOR(shown_regions[j]); })
                           .attr("transform", "translate(13, 0)")
                           .style("opacity", 0.5)
                           .attr("class", "mark");

      // show lines for each checked region and the chosen year
      const line = FRAME1.append("g")
                       .append("path")
                       .datum(lineChartFilter)
                       .attr("d", d3.line()
                          .x(function(d) { return (MONTH_SCALE(d.Month) + MARGINS.left); })
                          .y(function(d) { return (PRECIP_SCALE1(d.Precipitation) + MARGINS.top); })
                            )
                       .attr("stroke", (d) => { return REGION_COLOR(shown_regions[j]); })
                       .attr("transform", "translate(13, 0)")
                       .style("stroke-width", 2)
                       .style("fill", "none")
                       .style("opacity", 0.5)
                       .attr("class", "dottedline");

      // Create tooltip
      const TOOLTIP1 = d3.select("#line")
                        .append("div")
                        .attr("class", "tooltip")
                        // Make it nonvisible at first
                        .style("opacity", 0); 

      // Event handler
      function handleMouseover1(event, d) {
        // on mouseover, make opaque 
        TOOLTIP1.style("opacity", 1); 
      }

      // Event handler
      function handleMousemove1(event, d) {
       // position the tooltip and fill in information 
       TOOLTIP1.html("Region: " + d.Region + "<br>Month: " + d.Month + "<br>Precipitation: "+ d.Precipitation + "<br>Year: " + d.YEAR)
               .style("left", (event.pageX + 20) + "px") //add offset
                                                           // from mouse
               .style("top", (event.pageY - 5) + "px");
      }

      // Event handler
      function handleMouseleave1(event, d) {
        // on mouseleave, make the tooltip transparent again 
        TOOLTIP1.style("opacity", 0); 
      }

      // Add tooltip event listeners
      FRAME1.selectAll(".mark")
            .on("mouseover", handleMouseover1)
            .on("mousemove", handleMousemove1)
            .on("mouseleave", handleMouseleave1);
      };
    });
   

    // Set up precipitation vs. drought level scatterplot - this one allows users to filter the data by year, month, and region

    // Find min SPI value
    const MIN_DROUGHT = d3.min(combined, (d) => { return parseFloat(d.x); });

    // Find max SPI value
    const MAX_DROUGHT = d3.max(combined, (d) => { return parseFloat(d.x); });

    // Scale SPI for the x-axis
    const SPI_SCALE = d3.scaleLinear() 
                        .domain([(MIN_DROUGHT - 0.5), (MAX_DROUGHT + 0.5)])   
                        .range([0, VIS_WIDTH]); 

    // Add X axis  
    const xAxis2 = FRAME2.append("g") 
                .attr("transform", "translate(" + MARGINS.left + "," + (VIS_HEIGHT + MARGINS.top) + ")") 
                .call(d3.axisBottom(SPI_SCALE).tickFormat(d3.format(".1f"))) 
                .attr("font-size", "10px")
                .selectAll("text")
                  .attr("transform", "translate(8, 0)")
                  .style("text-anchor", "end");

    // Add Y axis
    const yAxis2 = FRAME2.append("g")       
                .attr("transform", "translate(" + MARGINS.left + "," + MARGINS.bottom + ")")
                .call(d3.axisLeft(PRECIP_SCALE1).ticks(20))
                .attr("font-size", "10px");

    // Label the x axis
    FRAME2.append("text")
      .attr("x", MARGINS.left + VIS_WIDTH/2)
      .attr("y", VIS_HEIGHT + 90)
      .text("Drought Severity (SPI)")
      .attr("class", "axes");
        
    // Label the y axis 
    FRAME2.append("text")
      .attr("x", MARGINS.left - 50)
      .attr("y", VIS_HEIGHT - 100)
      .attr("transform", "translate(-290, 250)rotate(-90)")
      .text("Precipitation (inches)")
      .attr("class", "axes"); 

    // initialize empty arrays for the years and months to be represented in the scatter plot
    let shown_years = [];
    let shown_months = [];
          
    // Filter the scatter plot by selected year(s)
    d3.selectAll(".year-button").on("change", function () {
      // retrieve the year associated with the checked/unchecked box
      let selected_year = this.value, 
      // determine whether the box is checked or unchecked
      display = this.checked ? year_display = "inline" : year_display = "none";

      // store the data for years associated with checked boxes
      if (year_display == "inline" && shown_years.includes(selected_year) == false){
        shown_years.push(selected_year);
      // omitting to plot data for years associated with unchecked boxes
      } else if (year_display == "none" && shown_years.includes(selected_year)){
          year_index = shown_years.indexOf(selected_year);
          shown_years.splice(year_index, 1);
      };
    });

    // Filter plot by selected month(s)
    d3.selectAll(".month-button").on("change", function () {
      // retrieve the month associated with the checked/unchecked box
      let selected_month = this.value, 
      // determine whether the box is checked or unchecked
      display = this.checked ? month_display = "inline" : month_display = "none";

      // store the data for months associated with checked boxes
      if (month_display == "inline" && shown_months.includes(selected_month) == false){
        shown_months.push(selected_month);
      // omitting to plot the data for months associated with unchecked boxes
      } else if (month_display == "none" && shown_months.includes(selected_month)){
          month_index = shown_months.indexOf(selected_month);
          shown_months.splice(month_index, 1);
      };
    });
      
    d3.select("#btn2").on("click", function() {
      // reset the scatter plot so that no points appear
      FRAME2.selectAll(".mark")
            .attr("display", "none");

      // Show data pertaining to years with checked boxes
      for (let i = 0; i < shown_years.length; i++) {
        // Show data pertaining to regions with checked boxes
        for (let j = 0; j < shown_regions.length; j++) {
          // Show data pertaining to months with checked boxes
          for (let k = 0; k < shown_months.length; k++) {
            let scatterFilter = combined.filter(function(d) { return d.Year == shown_years[i]; })
                                        .filter(function(d) { return d["Drought Region"] == shown_regions[j]; })
                                        .filter(function(d) { return d.Month == shown_months[k]; });

      // Plot points on scatter plot
      const myPoint2 = FRAME2.append("g")
                             .selectAll("points")  
                             .data(scatterFilter)  
                             .enter()       
                             .append("circle")  
                             .attr("cx", (d) => { return (SPI_SCALE(d.x) + MARGINS.left); }) 
                             .attr("cy", (d) => { return (PRECIP_SCALE1(d.Precipitation) + MARGINS.top); }) 
                             .attr("r", 5)
                             .attr("fill", (d) => { return REGION_COLOR(d["Drought Region"]); })
                             .attr("class", "mark")
                             .style("opacity", 0.5);

      // Create tooltip
      const TOOLTIP2= d3.select("#scatter")
                        .append("div")
                        .attr("class", "tooltip")
                        // Make it nonvisible at first
                        .style("opacity", 0); 

      // Event handler
      function handleMouseover2(event, d) {
        // On mouseover, make opaque 
        TOOLTIP2.style("opacity", 1); 
      }

      // Event handler
      function handleMousemove2(event, d) {
       // position the tooltip and fill in information 
       TOOLTIP2.html("Region: " + d["Drought Region"] + "<br>3-Month SPI: " + d.x + "<br>Precipitation: " + d.Precipitation + "<br>Year: " + d.Year + "<br>Month: " + d.Month)
               .style("left", (event.pageX + 20) + "px") //add offset
                                                           // from mouse
               .style("top", (event.pageY - 5) + "px"); 
      }

      // Event handler
      function handleMouseleave2(event, d) {
        // On mouseleave, make the tooltip transparent again 
        TOOLTIP2.style("opacity", 0); 
      }

      // Add tooltip event listeners
      FRAME2.selectAll(".mark")
            .on("mouseover", handleMouseover2)
            .on("mousemove", handleMousemove2)
            .on("mouseleave", handleMouseleave2);
          };
        };
      };
    });

    // Bar chart showing precipitation values per region - used to link with the scatterplot below of SPI vs. precipitation

    // Find the minimum annual precipitation (y) value
    const MIN_ANNUAL_PRECIP = d3.min(combined, (d) => { return parseFloat(d["Annual Precipitation"]); });

    // Find the max annual precipitation (y) value
    const MAX_ANNUAL_PRECIP = d3.max(combined, (d) => { return parseFloat(d["Annual Precipitation"]); });

    // Scale X
    const REGION_SCALE = d3.scaleBand()
                         .range([ 0, VIS_WIDTH ])
                         .domain(combined.map(function(d) { return d["Drought Region"]; }))
                         .padding(0.2);

    // Scale Y
    const PRECIP_SCALE2 = d3.scaleLinear()
                          .domain([MIN_ANNUAL_PRECIP - 10, MAX_ANNUAL_PRECIP + 1])
                          .range([ VIS_HEIGHT, 0]);

    // Add X axis  
    const xAxis3 = FRAME4.append("g") 
                .attr("transform", "translate(" + MARGINS.left + "," + (VIS_HEIGHT + MARGINS.top) + ")") 
                .call(d3.axisBottom(REGION_SCALE)) 
                .attr("font-size", "10px")
                .attr("class", "x axis")
                .selectAll("text")
                  .attr("transform", "translate(-10, 0) rotate(-45)")
                  .style("text-anchor", "end");

    // Add Y axis
    const yAxis3 = FRAME4.append("g")       
                .attr("transform", "translate(" + MARGINS.left + "," + MARGINS.bottom + ")")
                .call(d3.axisLeft(PRECIP_SCALE2).ticks(20))
                .attr("font-size", "10px");

    // Label the x axis
    FRAME4.append("text")
      .attr("x", MARGINS.left + VIS_WIDTH/2)
      .attr("y", VIS_HEIGHT + 90)
      .attr("transform", "translate(0, 35)")
      .text("Region")
      .attr("class", "axes");
        
    // Label the y axis 
    FRAME4.append("text")
      // .attr("text-anchor", "middle")
      .attr("x", 0 - VIS_HEIGHT/2 - MARGINS.top)
      .attr("y", 15)
      .attr("transform", "rotate(-90)")
      .text("Annual Precipitation (inches)")
      .attr("class", "axes");

    // Scatterplot showing precipitation (y axis) vs SPI (x axis) - used to link with the bar plot above

    // Add X axis  
    const xAxis4 = FRAME5.append("g") 
                .attr("transform", "translate(" + MARGINS.left + "," + (VIS_HEIGHT + MARGINS.top) + ")") 
                .call(d3.axisBottom(SPI_SCALE).tickFormat(d3.format(".1f"))) 
                .attr("font-size", "10px")
                .selectAll("text")
                  .attr("transform", "translate(8, 0)")
                  .style("text-anchor", "end");

    // Add Y axis
    const yAxis4 = FRAME5.append("g")       
                .attr("transform", "translate(" + MARGINS.left + "," + MARGINS.bottom + ")")
                .call(d3.axisLeft(PRECIP_SCALE1).ticks(20))
                .attr("font-size", "10px");

    // Label the x axis
    FRAME5.append("text")
      .attr("x", MARGINS.left + VIS_WIDTH/2)
      .attr("y", VIS_HEIGHT + 90)
      .text("Drought Severity (SPI)")
      .attr("class", "axes");
        
    // Label the y axis 
    FRAME5.append("text")
      .attr("x", MARGINS.left - 50)
      .attr("y", VIS_HEIGHT - 100)
      .attr("transform", "translate(-290, 250)rotate(-90)")
      .text("Precipitation (inches)")
      .attr("class", "axes");


    // Display the points and bars that align with the filters chosen each time a button is clicked
    d3.select("#btn3").on("click", function() {

      // Retrieve the year selected by the user
      let selected_year2 = updateYear("selectYear2");

      // Filter the combined SPI and precipitation data by the chosen year
      let linked_filtered = combined.filter(function (d) { return parseInt(d.Year) == selected_year2; });

      // Reset the plot before projecting the new bars 
      FRAME4.selectAll("g rect")
                .attr("display", "none");

      // Reset the plot before projecting the new points
      FRAME5.selectAll("g circle")
                .attr("display", "none");

      // Add brushing
      FRAME5.call( d3.brush()                 // Use d3.brush to initalize a brush feature
                    .extent( [ [0,0], [FRAME_WIDTH, FRAME_HEIGHT] ] ) // establish the brush area (maximum brush window = entire graph area)
                    .on("start brush", updateChart1)); // 'updateChart1' is triggered every time the brush window gets altered

      // Plot points on scatter plot for the selected regions
      const myPoint3 = FRAME5.append("g")
                           .selectAll("points")  
                           .data(linked_filtered)  
                           .enter()       
                           .append("circle")  
                           .attr("cx", (d) => { return (SPI_SCALE(d.x) + MARGINS.left); }) 
                           .attr("cy", (d) => { return (PRECIP_SCALE1(d.Precipitation) + MARGINS.top); }) 
                           .attr("r", 5)
                           .attr("fill", (d) => { return REGION_COLOR(d["Drought Region"]); })
                           .attr("opacity", 0.5)
                           .attr("class", "mark");


      // Add bars for the selected regions, which are scaled accordingly
      const myBar = FRAME4.append("g")
                            .selectAll("mybar")
                            .data(linked_filtered)
                            .enter()
                            .filter(function(d) { return d["Drought Region"]; })
                            .append("rect")
                            .attr("x", (function(d) { return REGION_SCALE(d["Drought Region"]); }))
                            .attr("y", (function(d) { return PRECIP_SCALE2(d["Annual Precipitation"]); }))
                            .attr("transform", "translate(" + MARGINS.left + "," + MARGINS.bottom + ")")
                            .attr("width", REGION_SCALE.bandwidth())
                            .attr("height", function(d) { return VIS_HEIGHT - PRECIP_SCALE2(d["Annual Precipitation"]); })
                            .attr("opacity", 0.05)
                            .attr("fill", (d) => { return REGION_COLOR(d["Drought Region"]); })
                            .attr("class", "bar");

      // When points are brushed over in any plot, the aligned bars in the other plot get highlighted with a raised opacity and attain a blue border. 
      function updateChart1(event) {
        selection = event.selection;   
        myPoint3.classed("selected", ((d) => { return isBrushed(selection, SPI_SCALE(d.x) + MARGINS.left, PRECIP_SCALE1(d.Precipitation) + MARGINS.top ); }));
        myBar.classed("selected", ((d) => { return isBrushed(selection, SPI_SCALE(d.x) + MARGINS.left, PRECIP_SCALE1(d.Precipitation) + MARGINS.top ); }));
      }

      // Returns TRUE if a point is in the selection window, returns FALSE if it is not
      function isBrushed(brush_coords, cx, cy) {
        let x0 = brush_coords[0][0],
            x1 = brush_coords[1][0],
            y0 = brush_coords[0][1],
            y1 = brush_coords[1][1];
        return x0 <= cx && cx <= x1 && y0 <= cy && cy <= y1;    // indicates which points are in the selection window via booleans
      }

      // When a bar is clicked, the aligned points that represent the same region in the other plot get highlighted with a raised opacity and attain a blue border
      function updateChart2(event, d) {
        myPoint3.classed("selected", ((j) => { return j["Drought Region"] == d["Drought Region"]; }));
        myBar.classed("selected", ((j) => { return j["Drought Region"] == d["Drought Region"]; }));
      }

      // Add the above event listener to all bars
      FRAME4.selectAll(".bar")
            .on("click", updateChart2);


      // Tooltips

      // Create tooltip for the scatter chart
      const TOOLTIP3 = d3.select("#link1")
                        .append("div")
                        .attr("class", "tooltip")
                        // Make it nonvisible at first
                        .style("opacity", 0); 

      // Create tooltip for the bar chart
      const TOOLTIP4 = d3.select("#link2")
                        .append("div")
                        .attr("class", "tooltip")
                        // Make it nonvisible at first
                        .style("opacity", 0); 

      // Event handlers
      function handleMouseover3(event, d) {
        // on mouseover, make opaque 
        TOOLTIP3.style("opacity", 1);
      }

      function handleMouseover4(event, d) {
        // on mouseover, make opaque 
        TOOLTIP4.style("opacity", 1);
      }

      // Event handlers
      function handleMousemove3(event, d) {
       // position the tooltip and fill in information 
       TOOLTIP3.html("Region: " + d["Drought Region"] + "<br>3-Month SPI: " + d.x + "<br>Year: " + d.Year  + "<br>Month: "  + d.Month)
               .style("left", (event.pageX + 20) + "px") //add offset
                                                           // from mouse
               .style("top", (event.pageY - 5) + "px"); 
      }

      function handleMousemove4(event, d) {
       // position the tooltip and fill in information 
        TOOLTIP4.html("Region: " + d["Drought Region"] + "<br>Annual Precipitation: " + d["Annual Precipitation"] + "<br>Year: " + d.Year)
               .style("left", (event.pageX + 20) + "px") //add offset
                                                           // from mouse
               .style("top", (event.pageY - 5) + "px");
      }

      // Event handlers
      function handleMouseleave3(event, d) {
        // on mouseleave, make the tooltip transparent again 
        TOOLTIP3.style("opacity", 0); 
      }

      function handleMouseleave4(event, d) {
        // on mouseleave, make the tooltip transparent again 
        TOOLTIP4.style("opacity", 0); 
      }

      // Add tooltip event listeners
      FRAME5.selectAll(".mark")
            .on("mouseover", handleMouseover3)
            .on("mousemove", handleMousemove3)
            .on("mouseleave", handleMouseleave3);

      FRAME4.selectAll(".bar")
            .on("mouseover", handleMouseover4)
            .on("mousemove", handleMousemove4)
            .on("mouseleave", handleMouseleave4);
    });

    // Add vertical line at x = 0 
    FRAME5.append("line")
      .attr("x1", SPI_SCALE(0.65))
      .attr("y1", 0)
      .attr("x2", SPI_SCALE(0.65))
      .attr("y2", VIS_HEIGHT + MARGINS.bottom)
      .attr("stroke", "black")
      .attr("stroke-dasharray", "5,5")
      .attr("fill", "none");

  });
});