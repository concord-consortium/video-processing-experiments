# Color detection using OpenCV in the browser

This example uses the opencv-node binding to allow us to send video
data (from WebRTC) to OpenCV running on the local server.

The server code (app.coffee) uses OpenCV to first filter the colors
on an HSV scale such that all reddish colors are picked out. We then
do some simple contour detection to find the contours and send them
back to the web application.

You can change the color being picked out by modifying the values of
`low_hsv_threshold` and `high_hsv_threshold` in app.coffee.

# Usage

Install OpenCV. Use node 0.10.20

`npm install`

If npm complains that it can't find opencv.pc, you will need to set the
PKG_CONFIG_PATH variable to the location of folder containing opencv.pc.

`$ export PKG_CONFIG_PATH=/usr/local/lib/pkgconfig`

You can add this to ~/.bashprofile

Even after this, on my machine (OS X 10.6.8) using node 0.10.20 I get an
error that cb() is never called, but this doesn't seem to affect the application.

`coffee app.coffee`

Open http://localhost:9999/

# Credits

Some of this code was originally from https://github.com/xenomuta/caraweb