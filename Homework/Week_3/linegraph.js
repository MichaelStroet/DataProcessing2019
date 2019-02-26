var fileName = "data.json";
var txtFile = new XMLHttpRequest();

txtFile.onreadystatechange = function() {
    if (txtFile.readyState === 4 && txtFile.status == 200) {
        var json = JSON.parse(txtFile.responseText);
        console.log(json)
        lineGraph(json, "Generation");
    }
}

txtFile.open("GET", fileName);
txtFile.send();

//Code komt van: https://web.archive.org/web/20130407101311/http://www.worldwidewhat.net/2011/06/draw-a-line-graph-using-html5-canvas/
function lineGraph(data, yData) {

  const canvas = document.getElementById('canvas');
  const c = canvas.getContext('2d');

  var xPadding = 30;
  var yPadding = 30;

  dataLength = Object.keys(data).length

  // Local Functions --------------------------------------------------------------

  var getMaxY = function() {

    var max = 0;

    for(var i = 0; i < dataLength; i++) {
        if(Object.values(data)[i][yData] > max) {
            max = Object.values(data)[i][yData];
        }
    }

    max += 10 - max % 10;
    return max;
  }

  var getXPixel = function(value) {
      return ((canvas.width - xPadding) / dataLength) * value + (xPadding * 1.5);
  }

  var getYPixel = function(value) {
      return canvas.height - (((canvas.height - yPadding) / getMaxY()) * value) - yPadding;
  }

  // ---------------------------------------------------------------------------

  // Axes properties
  c.lineWidth = 2;
  c.strokeStyle = '#333';
  c.font = 'italic 8pt sans-serif';
  c.textAlign = "center";

  // Draw axes
  c.beginPath();
  c.moveTo(xPadding, 0);
  c.lineTo(xPadding, canvas.height - yPadding);
  c.lineTo(canvas.width, canvas.height - yPadding);
  c.stroke();

  // Draw x axis values
  for(var i = 0; i < dataLength; i += 30) {
      c.fillText(Object.keys(data)[i], getXPixel(i), canvas.height - yPadding + 20);
  }

  // Draw y axis values
  c.textAlign = "right"
  c.textBaseline = "middle";

  for(var i = 0; i < getMaxY(); i += 2) {
      c.fillText(i, xPadding - 10, getYPixel(i));
  }

  // Draw data lines
  c.strokeStyle = '#f00';
  c.beginPath();
  c.moveTo(getXPixel(0), getYPixel(Object.values(data)[0][yData]));

  for(var i = 1; i < dataLength; i++) {
      c.lineTo(getXPixel(i), getYPixel(Object.values(data)[i][yData]));
  }
  c.stroke();
}
