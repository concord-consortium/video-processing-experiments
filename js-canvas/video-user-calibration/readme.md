# Color and contour detection of live video with calibrations

This example uses Javascript to process a video feed. We first request the
video using WebRTC, and draw each frame to the canvas. We then process the
image using the techniques from color-detection2.

This example also includes the ability to change the processing calibrations
using the in-page sliders.

### Usage

To avoid cross-origin complaints, use a local server to open index.html.

If you have python installed, the easiest way to do this is

    cd path/to/color-detection
    python -m  SimpleHTTPServer

and then open [http://localhost:8000](http://localhost:8000)

### Credits

cv.js is (c) 2012 Juan Mellado, its license is in lib/cv.js.