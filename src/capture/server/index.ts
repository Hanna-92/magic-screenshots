var app = require('express')();
var http = require('http').createServer(app);
var io = require('socket.io')(http);
import Suite from '../suite'
import ImageCaptureSpec from '../spec';
import runSuite from '../suite';
import loginExtension from '../example_extension/loginExtension';
import languageUrlRewrite from '../example_extension/languageParamExtensions';

app.post('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

io.on('connection', (socket) => {
  console.log('a user connected');
  socket.on('createNew', (data, fn) => {
        console.log('data received')
        console.log(data)
        fn(`We're working on your request for ${data.name}`);

        const newSpec: ImageCaptureSpec = {
            baseUrl: new URL(data.baseUrl),
            name: data.name,
            selector: data.selector
        }

        const suite = {
            captureList: [newSpec],
            desiredLanguages: data.languages
        }

        runSuite(suite, {
            broswerHooks: {onBrowserReady: loginExtension},
            captureHooks: {urlRewrite: languageUrlRewrite, onCaptureState: (s) => socket.emit('progress', s)}
        })
    });
});

http.listen(3001, () => {
  console.log('listening on *:3001');
});