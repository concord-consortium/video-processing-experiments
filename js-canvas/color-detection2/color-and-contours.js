var minH = 35,
    maxH = 75,
    minS = 0.3,
    maxS = 1,
    minV = 0.3,
    maxV = 1;


window.onload = function() {
  var img = new Image(),
      ctx = canvas1.getContext('2d'),
      ctx2 = canvas2.getContext('2d'),
      ctx3 = canvas3.getContext('2d'),
      hsvThreshold = new HSVThreshold(minH, maxH, minS, maxS, minV, maxV);

  img.onload = processImage;
  img.src = 'cake.jpg';

  function processImage() {
    var imgData, data, len, i, mask,
        r, g, b,
        inRange, image2, image3, erodedImg,
        contours, points;

    ctx.drawImage(img, 0, 0);
    imgData = canvas1.getContext('2d').getImageData(0, 0, 400, 300);
    data = imgData.data;
    mask = new CV.Image(400,300);
    len = data.length;
    i = 0;

    // filter pixels to HSV thresholds
    // mask.data is a data array where every element is 255 or a 0, for a pixel
    // that is white or black. It will be expanded into an array that can
    // be drawn in the canvas just before we draw it, but CV.js uses this
    // simpler array for fastert data processing
    while (i < len) {
      r = data[i];
      g = data[i+1];
      b = data[i+2];
      inRange = hsvThreshold.testPixel(r, g, b);
      if (inRange) {
        mask.data.push(255);
      } else {
        mask.data.push(0);
      }
      i += 4;
    }

    // draw filtered images to canvas 2
    image2 = createDrawableImage(mask, canvas2.getContext('2d').getImageData(0, 0, 400, 300));
    ctx2.putImageData(image2, 0, 0);

    // erode-dilate several times to remove imperfections
    erodedImg = new CV.Image();
    CV.erode(mask, erodedImg);
    CV.dilate(erodedImg, mask);
    CV.dilate(mask, erodedImg);
    CV.dilate(erodedImg, mask);
    CV.erode(mask, erodedImg);
    CV.erode(erodedImg, mask);

    // draw image to canvas 3
    image3 = createDrawableImage(mask, canvas3.getContext('2d').getImageData(0, 0, 400, 300));
    ctx3.putImageData(image3, 0, 0);

    // find contours and draw to canvas 3
    contours = CV.findContours(mask);

    for (i in contours) {
      points = contours[i];

      if (points && points.length) {
        ctx3.beginPath();
        ctx3.moveTo(points[0].x, points[0].y);
        for (var p = 1; p < points.length; p++) {
          ctx3.lineTo(points[p].x, points[p].y);
        }
        ctx3.closePath();
        ctx3.lineWidth = 3;
        if (points.length == 4) {
          ctx3.strokeStyle = "#a22";
        } else if (points.length == 3) {
          ctx3.strokeStyle = "#2a2";
        } else {
          ctx3.strokeStyle = "#2ba6cb";
        }
        ctx3.stroke();
      }
    }
  }


  function createDrawableImage(imageSrc, imageDst){
      var src = imageSrc.data, dst = imageDst.data,
          len = src.length, i = 0, j = 0;

      for(i = 0; i < len; i++){
          dst[j] = dst[j + 1] = dst[j + 2] = src[i];
          dst[j + 3] = 255;
          j += 4;
      }

      return imageDst;
    }
};