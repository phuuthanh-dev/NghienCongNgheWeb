module.exports.createPost = (req, res, next) => {
    console.log(req.body);
    
    if (!req.body.title) {
        req.flash('error', 'Vui lòng nhập tiêu đề!')
        res.redirect('back')
        return
    }

    next()
}