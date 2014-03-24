# Color and contour detection using Javascript #2

This example uses Javascript to process a canvas image. It follows from the
color-detection example, but uses the cv.js library to greatly speed up
the contour finding.

The cv.js library also handles eroding and dilating the image, which allows
us to remove the noise from the filtered image.

### Usage

To avoid cross-origin complaints, use a local server to open index.html.

If you have python installed, the easiest way to do this is

    cd path/to/color-detection
    python -m  SimpleHTTPServer

and then open [http://localhost:8000](http://localhost:8000)

### Credits

cv.js is (c) 2012 Juan Mellado, its license is in lib/cv.js.