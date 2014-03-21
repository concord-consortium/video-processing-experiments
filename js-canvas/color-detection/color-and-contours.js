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
      hsvThreshold = new HSVThreshold(minH, maxH, minS, maxS, minV, maxV);

  img.onload = processImage;
  img.src = 'cake.jpg';

  function processImage() {
    var imgData, data, len, i,
        r, g, b,
        hsv;
    ctx.drawImage(img, 0, 0);
    imgData = canvas1.getContext('2d').getImageData(0, 0, 400, 300);
    data = imgData.data;
    len = data.length;
    i = 0;
    while (i < len) {
      r = data[i];
      g = data[i+1];
      b = data[i+2];
      inRange = hsvThreshold.testPixel(r, g, b);
      if (inRange) {
       data[i] = data[i+1] = data[i+2] = 255;
      } else {
        data[i] = data[i+1] = data[i+2] = 0;
      }
      i += 4;
    }
    ctx2.putImageData(imgData, 0, 0);

    findContours(canvas2,255,0,125,canvas3);
  }
};