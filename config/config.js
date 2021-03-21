const config = {
    production : {
        SECRET: process.env.SECRET,
        DATABASE: process.env.MONGODB_URI
    },
    default: {
        SECRET: 'bt9#174^vyp4kugv$j$ah1cg6b2dt5p1@1a*p=gpv36gr2hbuw',
        DATABASE: 'mongodb://localhost:27017/Stacky'
    }
}

exports.get = function get(env) {
    return config[env] || config.default
}
