var fileName = "data.json";
var txtFile = new XMLHttpRequest();

txtFile.onreadystatechange = function() {
    if (txtFile.readyState === 4 && txtFile.status == 200) {
        var json = JSON.parse(txtFile.responseText);
        lineGraph(json, "Generation");
    }
}

txtFile.open("GET", fileName);
txtFile.send();


function timeConverter(timestamp){
  var time = new Date(timestamp * 1000);
  var months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  var month = months[time.getMonth()];
  var day = time.getDate();

  return {"day" : day, "month" : month};
}


// Function based on code from Lars Jarlvik, 'Draw a Line Graph Using HTML5 Canvas', 2011, accessed: 26 februari 2019
// URL: https://web.archive.org/web/20130407101311/http://www.worldwidewhat.net/2011/06/draw-a-line-graph-using-html5-canvas/
function lineGraph(data, yData) {
  /*
  Draws a linegraph of a data object using yData for the Y-axis
  and UNIX timestamps for the X-axis
  */

  // Local Functions --------------------------------------------------------------

  var getMaxY = function() {
    /*
    Determines the largest Y value in the data object
    and returns a slightly larger number
    */

    var max = 0;

    for(var i = 0; i < dataLength; i++) {
        if(Object.values(data)[i][yData] > max) {
            max = Object.values(data)[i][yData];
        }
    }

    return max * 1.2;
  }

  var getXPixel = function(value) {
      /*
      Calculates the relative x-pixel position for the given x-value
      */
      return ((canvas.width - xPadding) / dataLength) * value + xPadding + 3;
  }

  var getYPixel = function(value) {
    /*
    Calculates the relative y-pixel position for the given y-value
    */
      return canvas.height - (((canvas.height - yPadding) / getMaxY()) * value) - yPadding;
  }

  // ---------------------------------------------------------------------------

  // Get the canvas element from the document and a 2D rendering context
  const canvas = document.getElementById('canvas');
  const c = canvas.getContext('2d');

  // Padding for the axes
  var xPadding = 30;
  var yPadding = 30;

  // Total amount of data points
  var dataLength = Object.keys(data).length

  // temporary canvas border
  c.lineWidth = 1;
  c.strokeStyle = '#ccc';
  c.rect(0, 0, canvas.width, canvas.height)
  c.stroke();

  // Draw axes
  c.lineWidth = 2;
  c.strokeStyle = '#000';

  c.beginPath();
  c.moveTo(xPadding, 0);
  c.lineTo(xPadding, canvas.height - yPadding);
  c.lineTo(canvas.width, canvas.height - yPadding);
  c.stroke();

  // Draw x-axis values
  c.lineWidth = 1;
  c.strokeStyle = '#bbb';
  c.font = 'italic 8pt sans-serif';
  c.textAlign = "center";

  // Draw the date of the first data point
  time = timeConverter(Object.keys(data)[0])
  c.fillText(time.day + ' ' + time.month, getXPixel(0), canvas.height - yPadding + 20);

  // Draw every first day of the month in the dataset, including a grid line
  for(var i = 1; i < dataLength; i++) {
      time = timeConverter(Object.keys(data)[i])
      if(time.day == 1) {
        xValue = getXPixel(i);
        c.fillText(time.day + ' ' + time.month, xValue, canvas.height - yPadding + 20)
        c.beginPath();
        c.moveTo(xValue, canvas.height - yPadding);
        c.lineTo(xValue, 0);
        c.stroke();
      };
  }

  // Draw y-axis values
  c.textAlign = "right"
  c.textBaseline = "middle";

  // Draw every other value, including a grid line
  for(var i = 0; i < getMaxY(); i += 2) {
    yValue = getYPixel(i)
    c.fillText(i, xPadding - 10, yValue);
    c.beginPath();
    c.moveTo(xPadding, yValue);
    c.lineTo(canvas.width, yValue);
    c.stroke();

  }

  // Draw data lines
  c.lineWidth = 2;
  c.strokeStyle = '#15f';
  c.beginPath();
  c.moveTo(getXPixel(0), getYPixel(Object.values(data)[0][yData]));

  for(var i = 1; i < dataLength; i++) {
      c.lineTo(getXPixel(i), getYPixel(Object.values(data)[i][yData]));
      console.log(Object.values(data)[i]);
      console.log("X:" + getXPixel(i) + ' Y:' + getYPixel(Object.values(data)[i][yData]));
  }
  c.stroke();
}