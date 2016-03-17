var express = require("express"),
    bodyParser = require("body-parser"),
    pg = require("pg"),
    app = express();

var port = process.env.PORT || 6667,
    dburl = process.env.DATABASE_URL;
    
module.exports = (function() {

    app.use(bodyParser.urlencoded({extended: true}));
    app.use(bodyParser.json());
    var router = express.Router();

    var dbclient = new pg.Client(dburl);
    dbclient.connect();
    dbclient.end();

    /* set the routes */

    router.get("/", function(request, result) {
        result.json({ message : "This is the default page. Nothing to see here" });
    });

    router.get("/theses", function(request, result) {
        result.json({ message : "This is where I list all the theses \o/" });
    });

    app.use("/", router);
    
    app.listen(port);

}());
