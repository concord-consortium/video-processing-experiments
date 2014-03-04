cv = require('opencv')
fs = require('fs')

app = require('http').createServer (req, res) ->
  file = if req.url is '/' then '/index.html' else req.url
  console.log "#{req.method} #{file}"
  fs.readFile "./static#{file}", (err, data) ->
    if err?
      res.write(404)
      return res.end "<h1>HTTP 404 - Not Found</h1>"
    res.writeHead(200)
    res.end data

io = require('socket.io').listen(app).on 'connection', (socket) ->
  socket.on 'frame', ({data, useCanny, lowThresh, highThresh, nIters, minArea, maxArea,
      approxPolygons, useHSV, lowerHSV, upperHSV, dilate}) ->
    return unless typeof(data) is 'string'
    data = data?.split(',')?[1]

    useCanny    ?= true
    lowThresh   ?= 0
    highThresh  ?= 100
    nIters      ?= 2
    minArea     ?= 500
    maxArea     ?= Infinity
    approxPolygons ?= false
    lowerHSV    ?= [170, 100, 0]
    upperHSV    ?= [180, 255, 255]
    dilate      ?= true

    # feed the data into OpenCV
    cv.readImage (new Buffer data, 'base64'), (err, im) ->

      im.convertHSVscale()

      if useHSV
        im.inRange(lowerHSV, upperHSV)    # filter colors

      if useCanny
        im.canny(lowThresh, highThresh)

      if dilate
        im.dilate(nIters)

      contours = im.findContours()

      data = {contours: [], size: contours.size()}
      for c in [0...contours.size()]
        area = contours.area(c)
        if area < minArea or area > maxArea then continue

        if approxPolygons
          arcLength = contours.arcLength(c, true)             # turn the contours into very low-res polygons
          contours.approxPolyDP(c, 0.1 * arcLength, true)     # to more easily distinguish squares and triangles

        data.contours[c] = []
        for i in [0...contours.cornerCount(c)]
          point = contours.point(c, i)
          data.contours[c][i] = {x: point.x, y: point.y}

      socket.volatile.emit('shapes', data)


io.disable('sync disconnect on unload')
io.enable('browser client minification')
io.enable('browser client etag')
io.enable('browser client gzip')
# io.enable('log');
io.set('log level', 1)
io.set('transports', [
    'websocket'
  # 'flashsocket'
  # 'htmlfile'
  'xhr-polling'
  'jsonp-polling'
])

app.listen(9999)

process.on 'uncaughtException', (err) ->
  console.error(err)
  socket?.emit('shapes', [])