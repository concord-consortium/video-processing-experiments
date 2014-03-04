$(function() {
  var video = document.querySelector('#live'),
      canvas = document.querySelector('#canvas'),
      canvas2 = document.querySelector('#canvas2'),
      fps = 16,
      ctx = canvas.getContext('2d'),
      ctx2 = canvas2.getContext('2d'),
      mainTimer,
      contours = [],

      debug = document.querySelector('#debug'),
      debugBtn = document.querySelector('#debugBtn');

  navigator.getMedia = (navigator.getUserMedia ||
                         navigator.webkitGetUserMedia ||
                         navigator.mozGetUserMedia ||
                         navigator.msGetUserMedia);

  navigator.getMedia({ video: true, audio: false }, function(stream) {
    video.src = window.URL.createObjectURL(stream);
  }, function (err) { console.error(err); });

  debugBtn.onclick = function (e) {
    e.preventDefault();
    if (debugBtn.className != 'round alert') {
      debugBtn.innerHTML = 'Close Debug';
      debugBtn.className = 'round alert';
      debug.style.display = 'block';
    } else {
      debug.style.display = 'none';
      debugBtn.className = 'round success';
      debugBtn.innerHTML = 'Open Debug';
    }
  }

  var socket = io.connect(top.location.origin); // 'http://localhost');
  socket.on('shapes', function (_shapes) {
    // console.log(_shapes)
    if (!_shapes || _shapes.length === 0) {
      return;
    }
    contours = _shapes.contours;
    if (debugBtn.className == 'round alert') {
      debug.innerHTML = JSON.stringify({size: _shapes.size, data: contours});
    }

  }).on('disconnect', function (data) {
    console.log("Disconnected!!!", data);
  });

  function captureAndDraw () {
    mainTimer = setInterval(function () {
      ctx.drawImage(video, 0, 0, 480, 360);
      ctx2.drawImage(video, 0, 0, 480, 360);
      if (contours && contours.length) {
        for (var i in contours) {
          var points = contours[i];

          if (points && points.length) {
            ctx2.beginPath();
            ctx2.moveTo(points[0].x, points[0].y);
            for (var p = 1; p < points.length; p++) {
              ctx2.lineTo(points[p].x, points[p].y);
            }
            ctx2.closePath();
            ctx2.lineWidth = 2;
            if (points.length == 4) {
              ctx2.strokeStyle = "#a22";
            } else if (points.length == 3) {
              ctx2.strokeStyle = "#2a2";
            } else {
              ctx2.strokeStyle = "#2ba6cb";
            }
            ctx2.stroke();
          }
        }
      }

      var maxArea = $("#area-slider").rangeSlider("max");
      if (maxArea == 15050) maxArea = Infinity;
      socket.emit('frame',
        {
          data: canvas.toDataURL("image/jpeg"),
          lowThresh: $("#canny-slider").rangeSlider("min"),
          highThresh: $("#canny-slider").rangeSlider("max"),
          minArea: $("#area-slider").rangeSlider("min"),
          maxArea: maxArea,
          approxPolygons: approxPolygons
        });
    }, 1000 / fps);
  }
  captureAndDraw();

  // *** jQuery widget setup ***
  var useRatio = false,
      lastMin = 0,
      lastMax = 300,
      approxPolygons = false;
  $('#canny-slider').rangeSlider({bounds: {min: 0, max: 300}, defaultValues: {min: 0, max: 100}});
  $("#canny-slider").bind("userValuesChanged", function(e, data){
    if (useRatio) {
      var ratio = +$("#ratio").val();
      if (Math.abs(data.values.min - lastMin) < 1) {
        lastMax = data.values.max;
        lastMin = Math.round(lastMax / ratio);
        $("#canny-slider").rangeSlider('min', lastMin);
      } else {
        lastMin = data.values.min;
        lastMax = Math.round(lastMin * ratio);
        $("#canny-slider").rangeSlider('max', lastMax);
      }
    } else {
      lastMin = data.values.min;
      lastMax = data.values.max;
    }
  });
  $('#area-slider').rangeSlider({bounds: {min: 0, max: 15050}, step: 50, defaultValues: {min: 500, max: 15050},
    formatter:function(val){
      return val == 15050 ? "Unlimited" : val.toString();
    }
  });
  $('#use-ratio').on('click', function(i, val) {
    useRatio = this.checked;
    var ratio = +$("#ratio").val(),
        max = $("#canny-slider").rangeSlider('max');
    $("#canny-slider").rangeSlider('min', Math.round(max / ratio));
  });
  $('#approx-ploygons').on('click', function(i, val) {
    approxPolygons = this.checked;
  });
});