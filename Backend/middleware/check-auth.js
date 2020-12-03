const jwt = require ('jsonwebtoken');

const httpError = require ('../models/http-error');

const privateKey = 'bo$$debo$$';

module.exports = (req, res, next) =>{

    if(req.method==="OPTIONS"){
        return next();
    }

    try {

        const token = req.headers.authorization.split(' ')[1];
        
        if(!token){
            throw new Error('Authentication failed !');
        }

        const decodedToken = jwt.verify(token, privateKey);
        req.userData={userId:decodedToken.userId};

        next();
        
    } catch (err) {

        console.log(err);
        const error = new httpError('Authentication failed !', 401);
        return next(error)
    }

}