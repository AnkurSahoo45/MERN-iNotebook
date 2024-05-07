const jwt = require('jsonwebtoken');

const JWT = "crackItMofo";

const fetchuser = (req, res, next) => {
    try{
        const token = req.header('auth-token');
        if(!token){
            res.status(401).send({error: "please authenticate using a valid token"})
        }
        const data = jwt.verify(token, JWT);
        req.user = data.user;
        next();
    } catch(err) {
        res.status(401).send({error: "please authenticate using a valid token"})
    }
}

module.exports = fetchuser;