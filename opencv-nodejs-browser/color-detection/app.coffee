cv = require('opencv')
fs = require('fs')

# HSV values. These ranges will find reddish colors
# Note: Hue: [0,180], Sat: [0,255], Val: [0,255]
lower_hsv_threshold = [170, 100, 0]
upper_hsv_threshold = [180, 255, 255]

minArea = 500

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
  socket.on 'frame', (data) ->
    return unless typeof(data) is 'string'
    data = data?.split(',')?[1]
    # feed the data into OpenCV
    cv.readImage (new Buffer data, 'base64'), (err, im) ->

      im.convertHSVscale()                                    # convert to HSV
      im.inRange(lower_hsv_threshold, upper_hsv_threshold)    # filter colors

      contours = im.findContours()

      data = {contours: [], size: contours.size()}
      for c in [0...contours.size()]
        if contours.area(c) < minArea then continue

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