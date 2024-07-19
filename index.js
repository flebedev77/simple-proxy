const express = require('express')
const Unblocker = require('unblocker');
const app = express();
const unblocker = new Unblocker({prefix: '/proxy/'});

// this must be one of the first app.use() calls and must not be on a subdirectory to work properly
app.use(unblocker);

app.get('/', function(req, res) {
    res.sendFile(__dirname + "/public/index.html");
});

// the upgrade handler allows unblocker to proxy websockets
app.listen(process.env.PORT || 8080, console.log("Server running on port 8080")).on('upgrade', unblocker.onUpgrade);