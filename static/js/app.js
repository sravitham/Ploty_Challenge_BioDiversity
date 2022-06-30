const url = "https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json";


function dropdown(){
    d3.json(url).then(data => {
        var sampleName = data.names;
        var dataid = d3.select("#selDataset")
        sampleName.forEach((sampleid)=> {
            dataid.append("option")
                .text(sampleid)
                .property("value", sampleid)
        })
        var firstSample = sampleName[0];
        metadata(firstSample);
        Graphs(firstSample);
    });
};

dropdown();

function metadata(id) {
    d3.json(url).then(data => {
        var sampleMetadata = data.metadata;
        var result = sampleMetadata.filter(obj => obj.id == id);
        var filterresult = result[0];
        var display = d3.select("#sample-metadata");
        display.html("");
        Object.entries(filterresult).forEach(([key, value]) => {
            display.append("h6").text(`${key}: ${value}`);
        });
    });
}

// ------Build Bar Chart and Buble Chart-----
function Graphs(id){
    d3.json(url).then(data => {
        var sampledata = data.samples;
        var filterresult = sampledata.filter(obj => obj.id == id);
        var result = filterresult[0];
        var otu_ids = result.otu_ids;
        var otu_labels = result.otu_labels;
        var sample_values = result.sample_values;

        var datatrace = {
            x: otu_ids,
            y: sample_values,
            text: otu_labels,
            mode: "markers",
            marker: {
            size: sample_values,
            color: otu_ids,
            colorscale: "Portland"
            }
        };
        var data = [datatrace];
        var layout = {
            title: 'Bacteria Cultures per Sample',
            showlegend: false,
            hovermode: 'closest',
            xaxis: {title:"OTU (Operational Taxonomic Unit) ID " + id},
            font: { color: "#49a81d", family: "Arial, Helvetica, sans-serif" },
            margin: {t:30}
        };
        Plotly.newPlot("bubble",data, layout);

        var datatrace = {
            x: sample_values.slice(0,10).reverse(),
            y: otu_ids.slice(0,10).map(otuID => `OTU ${otuID}`).reverse(),
            text: otu_labels.slice(0,10).reverse(),
            name: "Greek",
            type: "bar",
            orientation: "h"
        };
        var data = [datatrace];
        var layout = {
            title: "Top Ten OTUs for Test Subject ID #: " + id,
            font: { color: "#49a81d", family: "Arial, Helvetica, sans-serif" }
        };
        Plotly.newPlot("bar", data, layout);  
        });

    };

function optionChanged(newid) {
    metadata(newid);
    Graphs(newid);
};

