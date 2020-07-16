var app = require('express')();
const fs = require('fs')
var https = require('https').createServer({
    key: fs.readFileSync('config/certs/server.key'),
    cert: fs.readFileSync('config/certs/server.crt')
},app);
var io = require('socket.io')(https);
import ImageCaptureSpec from '../spec';
import runSuite from '../suite';
import loginExtension from '../example_extension/loginExtension';
import languageUrlRewrite from '../example_extension/languageParamExtensions';
import deleteImage from '../delete';

app.get('/', (req, res) => {
  res.send('hello http')
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
            captureHooks: {urlRewrite: languageUrlRewrite, onCaptureState: (s) => socket.emit('progress', s)},
            onError: (e) => socket.emit('error', e)
        })
    });

    socket.on('delete', (data, fn) => {
      fn(`We're working on your request to delete ${data.name}`);
      socket.emit(`Deleting ${data.name}`)
      deleteImage(data.name)
      socket.emit(`${data.name} deleted`)
    })
});

https.listen(3001, () => {
  console.log('listening on *:3001');
});
