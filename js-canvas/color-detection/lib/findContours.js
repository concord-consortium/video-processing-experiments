// Basic algorithm is from
// http://www.imageprocessingplace.com/downloads_V3/root_downloads/tutorials/contour_tracing_Abeer_George_Ghuneim/moore.html
// Note, this is very slow...

(function() {

  var width,
      height,
      pixels,
      fColor,
      bColor,
      maxContourPoints = 5000,
      allContours = [],

      offset = function(x, y) { return (y * width + x) * 4; },

      getPixel = function(x, y) {
        var i = offset(x, y);
        return [
          pixels[i],      // r
          pixels[i + 1]   // g
        ];
      },

      getPixelI = function(i) {
        return [
          pixels[i],      // r
          pixels[i + 1]   // g
        ];
      },

      followContour = function(startPoint) {
        var points = [],
            point = startPoint,
            numPoints = 0,
            nextNeighbor = 0,

            neighborhood = [
              { xd:  1, yd:  0, offs:  1, next: 3 }, // east
              { xd:  0, yd:  1, offs:  width, next: 0 }, // south
              { xd: -1, yd:  0, offs: -1, next: 1 }, // west
              { xd:  0, yd: -1, offs: -width, next: 2 }  // north
            ],

            index,
            prevIndex,
            nIndex,
            newPoint,
            i, j;

        points.push(startPoint);

        do {
          // go clockwise through neighbors
          index = offset(point.x, point.y);
          pixels[index] = 0; // r
          pixels[index+2] = 0; // b
          newPoint = {};
          i = nextNeighbor;
          for(j = 0; j < neighborhood.length; j++) {
            nIndex = index + neighborhood[i].offs * 4;
            if(pixels[nIndex+1] == fColor && nIndex != prevIndex) {
              newPoint = { x: point.x + neighborhood[i].xd, y: point.y + neighborhood[i].yd };
              nextNeighbor = neighborhood[i].next;
              break;
            }

            i++;
            i = i % neighborhood.length;

          }
          if(newPoint === undefined) {
            break;
          } else {
            point = newPoint;
            points.push(point);

          }

          prevIndex = index;

          numPoints++;

        } while(!(point.x == startPoint.x && point.y == startPoint.y) && numPoints < maxContourPoints);

        return points;
      },

      findContours = function(canvas,foregroundColor,backgroundColor,threshold,drawableCanvas) {
        width = canvas.width;
        height = canvas.height;
        fColor = foregroundColor;
        bColor = backgroundColor;
        threshold = threshold;

        var ctx = canvas.getContext('2d'),
            imageData = ctx.getImageData(0,0,width, height),
            prevValue = 0,
            i = 0,
            x, y,
            pix,
            value,
            points;

        pixels = imageData.data;

        for (y = 0; y < height; y++) {
          for (x = 0; x < width; x++) {
            pix = getPixelI(i);
            i += 4;

            value = pix[1];
            value = (value > threshold) ? 255 : 0;
            // if we enter a foreGround color and red isn't 0 (already stored as contour)
            if(prevValue == backgroundColor && value == foregroundColor && pix[0] !== 0) {
              points = followContour({ x: x, y: y });
              allContours.push(points);
            }

            prevValue = value;
          }
        }

        // copy the image data back onto the canvas
        drawableCanvas.getContext('2d').putImageData(imageData, 0, 0); // at coords 0,0
      };


  window.findContours = findContours;
})();