# Shape detection using OpenCV in the browser with user calibration

This example extends the shape-detection example by adding user calibration.

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