(function() {
    // Create the connector object
    var myConnector = tableau.makeConnector();

    // Define the schema
    myConnector.getSchema = function(schemaCallback) {
        var cols = [{
            id: "Province",
            alias: "Province",
            dataType: tableau.dataTypeEnum.string,
            description: "Province or State for the cases"
        },{
            id: "Country",
            alias: "Country",
            dataType: tableau.dataTypeEnum.string,
            description: "Country or Region for the cases"
        },{
            id: "LastUpdate",
            alias: "Last Update",
            dataType: tableau.dataTypeEnum.datetime,
            description: "Last Updated date time"
        },{
            id: "Confirmed",
            alias: "Confirmed cases",
            dataType: tableau.dataTypeEnum.int,
            description: "Number of positive cases"
        }, {
            id: "Deaths",
            alias: "Death cases",
            dataType: tableau.dataTypeEnum.int,
            description: "Number of Death cases"
        }, {
            id: "Recovered",
            alias: "Recovered cases",
            dataType: tableau.dataTypeEnum.int,
            description: "Number of Recovered cases"
        }, {
            id: "Latitude",
            alias: "Latitude",
            dataType: tableau.dataTypeEnum.float,
            description: "Latitude of the location"
        }, {
            id: "Longitude",
            alias: "Longitude",
            dataType: tableau.dataTypeEnum.float,
            description: "Longitude of the location"
        }];

        var tableSchema = {
            id: "covid2019",
            alias: "Covid 2019 aggregated based on state(if not found) on the ",
            columns: cols
        };

        schemaCallback([tableSchema]);
    };

    // Download the data
    myConnector.getData = function(table, doneCallback) {
        $.getJSON("https://covid-api.quintessential.gr/data", function(resp) {
            var feat = resp.features,
                tableData = [];

            // Iterate over the JSON object
            for (var i = 0, len = resp.length; i < len; i++) {
                json_parsed = resp[i]
                tableData.push({
                    "Province": json_parsed["Province/State"],
                    "Country":json_parsed["Country/Region"],
                    "LastUpdate": json_parsed["Last Update"],
                    "Confirmed": json_parsed.Confirmed,
                    "Deaths": json_parsed.Deaths,
                    "Recovered": json_parsed.Recovered,
                    "Latitude": json_parsed.Latitude,
                    "Longitude": json_parsed.Longitude
                });
            }

            table.appendRows(tableData);
            doneCallback();
        });
    };

    tableau.registerConnector(myConnector);

    // Create event listeners for when the user submits the form
    $(document).ready(function() {
        $("#submitButton").click(function() {
            tableau.connectionName = "Quintessential Covid data"; // This will be the data source name in Tableau
            tableau.submit(); // This sends the connector object to Tableau
        });
    });
})();
