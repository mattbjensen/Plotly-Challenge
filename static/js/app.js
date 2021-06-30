// Plotly.js Homework Challenge: Belly Button Biodiversity
// Using 'samples.json' --> get data for names, metadata, samples

function getMetadata( sample) {
  d3.json("../../data/samples.json").then(( data) => {
    var metadata = data.metadata;
    var resultsArray = metadata.filter( sampleObject => 
      sampleObject.id == sample);
    var result = resultsArray[0]

// Use d3 to select the panel with id of `#sample-metadata`
    var panel = d3.select( "#sample-metadata");
    panel.html( "");

// Add each key-value pair to the panel
    Object.entries( result).forEach(([key, value]) => {
      panel.append( "h6").text(`${key}: ${value}`);
    });
  });
}


//------------Bubble Chart & Bar Chart Functions------------//

function createCharts( sample) {

// Fetch the sample data for the plots
d3.json("../../data/samples.json").then(( data) => {
  var samples = data.samples;
  var resultsArray = samples.filter( sampleObject => 
      sampleObject.id == sample);
  var result = resultsArray[0]

  var ids = result.otu_ids;
  var labels = result.otu_labels;
  var values = result.sample_values;

/*
----------------------------------------------------------
----------------------- Bar Chart ------------------------
----------------------------------------------------------
*/

var barData =[{
    y:ids.slice( 0, 10).map( otuID => `OTU ${otuID}`).reverse(),
    x:values.slice( 0,10).reverse(),
    text:labels.slice( 0,10).reverse(),
    type:"bar",
    orientation:"h"
  }];

var barLayout = {
  title: '<b>Top 10 Bacteria Cultures Found</b>',
  margin: {t: 30, l: 150}
};

Plotly.newPlot("bar", barData, barLayout);

/*
----------------------------------------------------------
---------------------- Bubble Chart ----------------------
----------------------------------------------------------
*/

var bubbleData = [{
  x: ids,
  y: values,
  text: labels,
  mode: "markers",
  marker: {
    color: ids,
    size: values,
    }
}];

var bubbleLayout = {
  margin: { t: 0 },
  xaxis: { title: '<b>OTU ID</b>' },
  hovermode: "closest",
};

  Plotly.newPlot( "bubble", bubbleData, bubbleLayout);
});
}


//----------------Gauge Chart Function----------------//

function createGaugeChart(sample) {
  console.log( "sample", sample);

  d3.json("../../data/samples.json").then( data =>{

    var objects = data.metadata;

    var sampleObj = objects.filter( sampleData => 
      sampleData["id"] === parseInt( sample));

    gaugeChart( sampleObj[0]);
  });   
}

// Color scheme for Gauge Chart
var arrColorsG = ["#80dfff", "#66d9ff", "#4dd2ff", "#33ccff", "#1ac6ff", "#00bfff", "#00ace6", "#0099cc", "#0086b3", "white"];

/*
----------------------------------------------------------
---------------------- Gauge Chart -----------------------
----------------------------------------------------------
*/

function gaugeChart( data) {
  console.log( "gaugeChart", data);

  if(data.wfreq === null){
    data.wfreq = 0;
  }

  let degree = parseInt( data.wfreq) * ( 180 / 10);

  // Trigonometry used for calculations
  let degrees = 180 - degree;
  let radius = .5;
  let radians = degrees * Math.PI / 180;
  let x = radius * Math.cos( radians);
  let y = radius * Math.sin( radians);

  let mainPath = 'M -.0 -0.025 L .0 0.025 L ',
      pathX = String( x),
      space = ' ',
      pathY = String( y),
      pathEnd = ' Z';
  let path = mainPath.concat( pathX, space, pathY, pathEnd);
  
  let trace = [{ type: 'scatter',
      x: [0], y:[0],
      marker: {size: 50, color:'2F6497'},
      showlegend: false,
      name: 'WASH FREQ',
      text: data.wfreq,
      hoverinfo: 'text+name'},
    {values: [1, 1, 1, 1, 1, 1, 1, 1, 1, 9],
    rotation: 90,
    text: ['8-9', '7-8', '6-7', '5-6', '4-5', '3-4', '2-3', '1-2', '0-1',''],
    textinfo: 'text',
    textposition:'inside',
    textfont:{
      size: 14,
      },
    marker: {colors:[...arrColorsG]},
    labels: ['8-9', '7-8', '6-7', '5-6', '4-5', '3-4', '2-3', '2-1', '0-1',''],
    hoverinfo: 'text',
    hole: .5,
    type: 'pie',
    showlegend: false
  }];

  let layout = {
    shapes:[{
        type: 'path',
        path: path,
        fillcolor: '#2F6497',
        line: {
          color: '#2F6497'
        }
      }],
    
    title: '<b>Belly Button Washing Frequency</b> <br> <b>Scrubs Per Week</b>',
    
    xaxis: {zeroline:false, showticklabels:false,
            showgrid: false, range: [-1, 1]},
    yaxis: {zeroline:false, showticklabels:false,
            showgrid: false, range: [-1, 1]},
  };

  Plotly.newPlot( 'gauge', trace, layout, {responsive: true});
}


//------------------ Initialize Functions ------------------//

function init() {
  // Create reference to the dropdown select element
  var selector = d3.select( "#selDataset");

  // Use the list of sample names to populate the selection options
  d3.json("../../data/samples.json").then(( data) => {
    var sampleNames = data.names;
    sampleNames.forEach(( sample) => {
      selector
        .append( "option")
        .text( sample)
        .property( "value", sample);
    });

    // Initialize using the first sample from the selection list
    const firstSelection = sampleNames[0];
    getMetadata( firstSelection);
    createCharts( firstSelection);
    createGaugeChart( firstSelection)
  });
}

// Funtion to update with new data for each new selection
function optionChanged( newSelection) {
  getMetadata( newSelection);
  createCharts( newSelection);
  createGaugeChart( newSelection)
}

// Initialize the online dashboard
init();