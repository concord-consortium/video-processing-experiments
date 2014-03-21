# Color and contour detection using Javascript

This example uses Javascript to process a canvas image.

This example first performs a quick and simple conversion of the image to a binary
(black/white) image based on HSV thresholds.

It then find the contours of the black and white image. Currently the pathfinding
algorithm is very slow...

### Usage

To avoid cross-origin complaints, use a local server to open index.html.

If you have python installed, the easiest way to do this is

    cd path/to/color-detection
    python -m  SimpleHTTPServer

and then open [http://localhost:8000](http://localhost:8000)

### Credits

The description of the pathfinding algorithm is from
http://www.imageprocessingplace.com/downloads_V3/root_downloads/tutorials/contour_tracing_Abeer_George_Ghuneim/moore.html