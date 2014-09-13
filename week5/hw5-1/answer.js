use blog;
db.post.aggregate([
    {
        $unwind: "$comments"},
    {
        $group: 
            {
                _id: {"author": "$comments.author"}, 
                "num_comments": {$sum: 1}
            }
    },
    {
        $sort:
            {
                "num_comments": -1
            }
    },
    {
        $limit: 5
    }
]);