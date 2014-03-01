# Color detection using OpenCV

This example uses open CV to separate and track individual items by color.

The application converts the video feed into HSV color-space, and then
uses min and max thresholds to filter out all but one color. It then
performs some simple image processing (erode + dilate) to remove noise
and pick out individual items.

The class item.cpp contains calibrations for specific items I used when
experimenting, but if main.cpp includes `calibrationMode = true` then the
application will bring up HSV sliders to allow you to find and separate an
item by its color.

# Usage

Install OpenCV.

Use Xcode (OS X) or Visual Studio (Windows).

Add the libraries libopencv_core.dylib, libopencv_highgui.dylib and
libopencv_imgproc.dylib to the build path. These will probably be found in
/usr/local/lib.

Open the project settings and set the Header Search Paths to be `usr/local/include`

Build and run main.cpp.

If callibrationMode=true, four windows should open up: the raw video feed, the
HSV-converted video feed, the binary (black and white) detection of colors, and
the sliders used to set the min and max HSV thresholds.

Use the sliders until only the item you want to track is white in the filtered
black and white feed. If you like, you can the save these values to item.cpp and
turn callibrationMode off to track the item immediately next time you run.

# Credits

Most of the code was written by Kyle Hounslow in these video tutorials,
https://www.youtube.com/watch?v=bSeFrPrqZ2A and https://www.youtube.com/watch?v=RS_uQGOQIdg.