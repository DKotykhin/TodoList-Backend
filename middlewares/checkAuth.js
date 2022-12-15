import jwt from 'jsonwebtoken';

const checkAuth = (req, res, next) => {
    try {
        if(!req.headers.authorization) {
            return res.status(403).json({
                message: "No autorization data"
            })
        }
        const token = req.headers.authorization.split(' ')[1];
        jwt.verify(token, process.env.SECRET_KEY, (err, decoded) => {
            if (err) {
                return res.status(403).json({
                    message: "Autorization denyed"
                })
            }
           req.userId = decoded._id;
           next()
        });
    } catch (err) {
        return res.status(500).json({
            message: err.message
        })
    } 
}

export default checkAuth;