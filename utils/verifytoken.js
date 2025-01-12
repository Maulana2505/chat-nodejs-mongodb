import jwt from 'jsonwebtoken'

function verifytoken(req, res, next) {
    try {
        const token = req.headers.authorization.split(" ")[1];
        if (!token) {
            res.status(400).json('Authentication failed!');
        }
        const decodetoekn = jwt.verify(token, 'SecretAbis');
        req.user = decodetoekn;
        next();
    } catch (error) {
        res.status(400).json({ message: "AInvalid Token!" });
        res.status(400).json(error);
    }
}
export default verifytoken