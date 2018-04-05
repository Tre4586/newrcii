let rcii_admin = {};

function CSVToArray(strData, strDelimiter) {
    // Check to see if the delimiter is defined. If not,
    // then default to comma.
    strDelimiter = (strDelimiter || ",");
    // Create a regular expression to parse the CSV values.
    var objPattern = new RegExp((
    // Delimiters.
    "(\\" + strDelimiter + "|\\r?\\n|\\r|^)" +
    // Quoted fields.
    "(?:\"([^\"]*(?:\"\"[^\"]*)*)\"|" +
    // Standard fields.
    "([^\"\\" + strDelimiter + "\\r\\n]*))"), "gi");
    // Create an array to hold our data. Give the array
    // a default empty first row.
    var arrData = [[]];
    // Create an array to hold our individual pattern
    // matching groups.
    var arrMatches = null;
    // Keep looping over the regular expression matches
    // until we can no longer find a match.
    while (arrMatches = objPattern.exec(strData)) {
        // Get the delimiter that was found.
        var strMatchedDelimiter = arrMatches[1];
        // Check to see if the given delimiter has a length
        // (is not the start of string) and if it matches
        // field delimiter. If id does not, then we know
        // that this delimiter is a row delimiter.
        if (strMatchedDelimiter.length && (strMatchedDelimiter != strDelimiter)) {
            // Since we have reached a new row of data,
            // add an empty row to our data array.
            arrData.push([]);
        }
        // Now that we have our delimiter out of the way,
        // let's check to see which kind of value we
        // captured (quoted or unquoted).
        if (arrMatches[2]) {
            // We found a quoted value. When we capture
            // this value, unescape any double quotes.
            var strMatchedValue = arrMatches[2].replace(
            new RegExp("\"\"", "g"), "\"");
        } else {
            // We found a non-quoted value.
            var strMatchedValue = arrMatches[3];
        }
        // Now that we have our value string, let's add
        // it to the data array.
        arrData[arrData.length - 1].push(strMatchedValue);
    }
    // Return the parsed data.
    return (arrData);
}

function CSV2JSON(csv) {
    var array = CSVToArray(csv);

    var objArray = [];

    for (var i = 1; i < array.length; i++) {
        objArray[i - 1] = {};
        for (var k = 0; k < array[0].length && k < array[i].length; k++) {
            var key = array[0][k];
            objArray[i - 1][key] = array[i][k]
        }
    }

    var json = JSON.stringify(objArray);
    var str = json.replace(/},/g, "},\r\n");

    return str;
}




// JSTREE #####################################################################################################
$(function () {
    var data = [
        { "id" : "ajson1", "parent" : "#", "text" : "Simple root node" },
        { "id" : "ajson2", "parent" : "#", "text" : "Root node 2" },
        { "id" : "ajson3", "parent" : "ajson2", "text" : "Child 1" },
        { "id" : "ajson4", "parent" : "ajson2", "text" : "Child 2" },
     ];

   $("#jstree").jstree({ 
     "core" : {
       // so that create works
       "check_callback" : true,
        
        "data": data
     },
    "plugins" : [ "contextmenu",  "dnd"],
        
        "contextmenu":{         
                        "items": {
                            "create": {
                                "label": "Add",
                                "action": function (obj) {
                                    $('#jstree').jstree().create_node('#' ,  { "id" : "ajson5", "text" : "newly added" }, "last", function(){
    alert("done");
 }); 
},
                            }
                        }
        }
        
  }).on('create_node.jstree', function(e, data) {
    console.log('saved');
});
$("#addnode").on("click",function() {
     $('#jstree').jstree().create_node('#' ,  { "id" : "ajson5", "text" : "newly added" }, "last", function(){
    alert("done");
 });
});
});

// #################################################################################################################

function convertToJSON(){  
    var csv = $("#csv").val();
    var json = CSV2JSON(csv);
    $("#json").val(json);
    rcii_admin.jsonFromText = JSON.parse(json);
    }


function reloadTree() {
    var stuff = [];
    stuff = document.getElementById('json').value;
    

    $('#jstree').jstree(true).settings.core.data = rcii_admin.jsonFromText;
    $('#jstree').jstree(true).refresh();    
}

// you can do something like this to trigger a click event with the tree
    //$('button').on('click', function () {
      //$('#jstree').jstree(true).select_node('child_node_1');
      //$('#jstree').jstree('select_node', 'child_node_1');
      //$.jstree.reference('#jstree').select_node('child_node_1');
    //});