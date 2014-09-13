db.zips.aggregate([
    { 
        $project:
            {
                '_id': 1,
                'pop': 1,
                'first_char': {$substr: ['$city', 0, 1]}
            }
    },
    { 
        $match:
            {
                 'first_char': {'$regex': /\d/}
            }
    },
    { 
        $group: 
            { 
                '_id': '',
                'pop': {'$sum': '$pop'}
            }
    }
])