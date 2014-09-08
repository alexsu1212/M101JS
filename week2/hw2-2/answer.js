var MongoClient = require("mongodb").MongoClient;

MongoClient.connect("mongodb://localhost:27017/weather", function(err, db) {

    if(err) throw err;

    var data = db.collection('data');

    // var query = {};
    // var operator = {'$set': {'test': true}};


    // data.update(query, operator)

    var cursor = data.find({});

    cursor.sort([['State', 1], ['Temperature', -1]])

    var curState = "";
    var lastTemp = -9999;

    // var operator = {'$set': {'month_high': true}};

    cursor.each(function(err, doc) {
        if(err) throw err;

        if(doc == null) {
            return db.close();
        }

        if(curState != doc.State) {
            curState = doc.State;
            doc.month_high = true;

            data.update({'_id': doc._id}, doc, function(err, updated) {
                console.log("Updated: " + updated);
                if(err) console.log(err);
                // db.close();
            });
        }
    });
});