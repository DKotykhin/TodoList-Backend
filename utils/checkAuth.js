import jwt from 'jsonwebtoken';

const checkAuth = (req, res, next) => {
    try {
        const token = req.headers.authorization.split(' ')[1];
        jwt.verify(token, process.env.SECRET_KEY, (err, decoded) => {
            if (err) {
                return res.status(403).json({
                    message: "Autorization error"
                })
            }
           req.userId = decoded._id;
           next()
        });
    } catch (err) {
        return res.status(403).json({
            message: "Autorization error"
        })
    } 
}

export default checkAuth;