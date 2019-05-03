//Create a PIE chart that uses data from your samples route (`/samples/<sample>`) 
//to display the top 10 samples.

function buildCharts(sample) {
console.log("buildCharts")

      // console.log("Pie Chart");
      var descriptions=[];

      d3.json("/samples/" + sample).then(function(response){

        console.log('Plot Pie Inside');
        console.log(response);

          var pielabels=response['otu_ids'].slice(0,10);
          var pievalues=response['sample_values'].slice(0,10);
          var piedescribe=response['otu_labels'].slice(0,10);

          console.log("pielabels " + pielabels) ;
          console.log("pievalues " + pievalues) ;
          console.log("piedescribe " + piedescribe); 

          var trace1 = { 
            values: pievalues,
            labels: pielabels,
            type:"pie",
            name:"Top 10 Samples",
            textinfo:"percent",
            text: piedescribe,
            textposition: "inside",
            hoverinfo: 'label+value+text+percent'
          }
          var data=[trace1];
          var layout={
              title: "<b>10 Sample Selection: " + sample + "</b>"

          }
          console.log("ready to plot pie chart")
          Plotly.newPlot("pie",data,layout);
  })

// * Create a Bubble Chart that uses data from your samples route 
//(`/samples/<sample>`) to display each sample. 

        d3.json("/samples/"+sample).then(function(response){
        console.log("In scatterplotk")
        console.log(response)
        var scatterk = response['otu_labels'];
        console.log("scatterk")
        console.log(scatterk.slice(0,10))
  
        var trace1 = {
            x: response['otu_ids'],
            y: response['sample_values'],
            marker: {
                size: response['sample_values']
            },
            type:"scatter",
            name: "Samples: Number of germs vs. ID",
            mode:"markers",
            text: scatterk,
            hoverinfo: 'x+y+text',
            color: response['otu_ids'].map(d=>100+d*20),
            colorscale: "Jet"   
        };

        console.log("trace1" + trace1)
        var data = [trace1];
        console.log(data)
        var layout = {

          xaxis:{title:"OTU ID",zeroline:true, hoverformat: '.2r'},
          yaxis:{title: "Number of Germs",zeroline:true, hoverformat: '.2r'},
          name:{title: "OTU ID vs. Number of Germs"},
          height: 500,
          width:1200,
          margin: {
              l: 80,
              r: 15,
              b: 60,
              t: 15,
              pad: 5
            },
          hovermode: 'closest',
      }; 

        console.log(layout)
        console.log("scatter/bubble chart")
        Plotly.newPlot("bubble",data,layout);
      
    })
  } 

//Display the sample metadata from the route `/metadata/<sample>`


function buildMetadata(sample) {
console.log("buildMetadata")

    //Use `d3.json` to fetch the sample data
    var url="/metadata/"+sample;
    console.log(url)
    console.log(sample)
  
      console.log(url);
      // Use d3 to select the panel with id of `#sample-metadata`
      d3.json(url).then(function(response){
        // if(error) {console.warn(error)};
        console.log(response);
        var metadata_Sample= d3.select("#sample-metadata");
        // Remove old metadata
        metadata_Sample.selectAll("p").remove();
    
        for(var key in response){
            if(response.hasOwnProperty(key)){
              console.log("key")
              console.log(response[key])
    
                metadata_Sample.append("p").text(key + ":   " + response[key]);
            }
        }
        console.log("Leave  buildMetadata   ")
    });  
}

//Dropdown menu

function init() {
  // Grab a reference to the dropdown select element
  console.log("inside the init function")
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("/names").then((sampleNames) => {
    console.log("sampleNames" + sampleNames)
    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // First Sample
    const sample1 = sampleNames[0];
    buildCharts(sample1);
    buildMetadata(sample1);
  });
}

function optionChanged(nextsample) {

  console.log(nextsample)

  // Refresh the sample
  buildCharts(nextsample);
  buildMetadata(nextsample);
}

// Initialize the dashboard
init();

