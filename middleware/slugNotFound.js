module.exports = (req, res, next) => { 
    const posts = require('../db/posts.json');
    const slugs = posts.map(post => post.slug)
    if (!slugs.includes(req.params.slug)) {
        res.format({
            json: () => { 
                res.status(404).json({
                    status: 404,
                    message: 'Post non trovato'
                });
            }
        })
    }
    next();
}