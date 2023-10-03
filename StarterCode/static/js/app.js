// Use the D3 library to read in samples.json from the URL
const url = "https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json"

function init() {

    // Dropdown menu
    let Dropdown = d3.select("#selDataset");

    d3.json(url).then((data) => {
        console.log(`Data: ${data}`);

        let names = data.names;

        names.forEach((name) => {
            Dropdown.append("option").text(name).property("value", name);
        });

        let name = names[0];

        demo(name);
        bar(name);
        bubble(name);
    });
}

// Bar Chart
function bar(selected) {
    d3.json(url).then((data) => {
        console.log(`Data: ${data}`);

        let samples = data.samples;

        let filteredData = samples.filter((sample) => sample.id === selected);

        let obj = filteredData[0];
        
        let trace = [{
            x: obj.sample_values.slice(0,10).reverse(),
            y: obj.otu_ids.slice(0,10).map((otu_id) => `OTU ${otu_id}`).reverse(),
            text: obj.otu_labels.slice(0,10).reverse(),
            type: "bar",
            marker: {
                color: "rgb(8,48,107)"
            },
            orientation: "h"
        }];
        
        Plotly.newPlot("bar", trace);
    });
}

// Bubble Chart
function bubble(selected) {
    d3.json(url).then((data) => {

        let samples = data.samples;
    
        let filteredData = samples.filter((sample) => sample.id === selected);
    
        let obj = filteredData[0];
        
        let trace = [{
            x: obj.otu_ids,
            y: obj.sample_values,
            text: obj.otu_labels,
            mode: "markers",
            marker: {
                size: obj.sample_values,
                color: obj.otu_ids,
                colorscale: "smoker"
            }
        }];
    
        let layout = {
            xaxis: {title: "OTU ID"}
        };
    
        Plotly.newPlot("bubble", trace, layout);
    });
}

// Demographics Info
function demo(selected) {
    d3.json(url).then((data) => {
        console.log(`Data: ${data}`);

        let metadata = data.metadata;
        
        let filteredData = metadata.filter((meta) => meta.id == selected);

        let obj = filteredData[0]
        
        d3.select("#sample-metadata").html("");

        let entries = Object.entries(obj);
        
        entries.forEach(([key,value]) => {
            d3.select("#sample-metadata").append("h5").text(`${key}: ${value}`);
        });

        console.log(entries);
    });
}

// Update all the plots when a new sample is selected
function optionChanged(selected) {
    demo(selected);
    bar(selected);
    bubble(selected);
}

init();