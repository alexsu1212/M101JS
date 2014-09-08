var MongoClient = require('mongodb').MongoClient,
    Promise = require('promise');

MongoClient.connect("mongodb://localhost:27017/school", function(err, db) {
    if(err) throw err;

    var students = db.collection('students'),
        cursor = students.find({}),
        updatePromises = [];

    new Promise(function (resolve, reject) {
        cursor.each(function(err, doc) {

            if(err) throw err;

            if(!doc) {
                resolve();
                return false;
            }

            var lowestScore = 1000,
                lowestIndex = 0;

            doc.scores.forEach(function(element, index) {
                if(element.type == 'homework') {
                    // console.log(element);
                    // count++;
                    // console.log(count);
                    if(element.score < lowestScore) {
                        lowestIndex = index;
                        lowestScore = element.score;
                    }
                }
            });

            doc.scores.splice(lowestIndex, 1);
            updatePromises.push(new Promise(function (resolve, reject) {
                students.update({'_id': doc._id}, {'$set': {'scores': doc.scores}}, function(err, updated) {
                    if(err) throw err;
                    resolve();
                });
            }));
        });
    }).then(function() {
        Promise.all(updatePromises).then(function () {
            db.close();
        });
    });
});