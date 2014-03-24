(function() {

  function rgb2hsv(r, g, b) {
    var min, max, delta, d, z,
        h, s, v;
    r /= 255;
    g /= 255;
    b /= 255;
    min = Math.min(r, g, b);
    max = Math.max(r, g, b);
    v = max;

    // Grey shortcut
    if (min == max) {
      return [0,0,v];
    }

    delta = max - min;

    if( max === 0 ) {
      // Black
      return [0,0,0];
    } else {
      s = delta / max;
    }

    if(r == max) {
      h = ( g - b ) / delta;
    } else if(g == max) {
      h = 2 + ( b - r ) / delta;
    } else {
      h = 4 + ( r - g ) / delta;
    }

    h *= 60;       // degrees
    if( h < 0 ) h += 360;

    return [h, s, v];
  }

  HSVThreshold = function(minH, maxH, minS, maxS, minV, maxV) {
    this.minH = minH;
    this.maxH = maxH;
    this.minS = minS;
    this.maxS = maxS;
    this.minV = minV;
    this.maxV = maxV;
  }

  HSVThreshold.prototype.testPixel = function (r, g, b) {
    hsv = rgb2hsv(r, g, b);
    return this.testHSVPixel(hsv);
  }

  HSVThreshold.prototype.testHSVPixel = function (hsv) {
    return !(hsv[0] < this.minH ||
        hsv[0] > this.maxH ||
        hsv[1] < this.minS ||
        hsv[1] > this.maxS ||
        hsv[2] < this.minV ||
        hsv[2] > this.maxV);
  }
})();