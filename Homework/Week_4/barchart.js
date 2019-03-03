/*
var fileName = "data.json";
var txtFile = new XMLHttpRequest();

txtFile.onreadystatechange = function() {
    if (txtFile.readyState === 4 && txtFile.status == 200) {
        var json = JSON.parse(txtFile.responseText);
    }
}

txtFile.open("GET", fileName);
txtFile.send();
*/

d3.select("body").append("p").text("New paragraph!");
