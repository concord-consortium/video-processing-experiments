# Shape detection using OpenCV in the browser

This example uses the opencv-node binding to allow us to send video
data (from WebRTC) to OpenCV running on the local server.

The server code (app.coffee) uses OpenCV to perform some very
simple image processing -- very heavy-handed polygon approximations
to try and find triangles and squares.

You can see the unprocessed contour detection by removing the two lines
starting with `arcLength = contours.arcLength(c, true)` in app.coffee.

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