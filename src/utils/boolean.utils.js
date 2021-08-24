const authBoolean = async (req, res, next) => {
    if (req.session.isAuth) next()
    else res.send(false)
}

module.exports = { authBoolean: authBoolean };