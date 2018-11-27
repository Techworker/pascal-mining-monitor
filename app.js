const Config = require('./src/Config');
const App = require('./src/App');
let config = new Config(__dirname + '/config.ini');

let app = new App(config);

