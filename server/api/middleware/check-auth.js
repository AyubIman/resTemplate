const jwt = require('jsonwebtoken');
module.exports = (req, res, next) => {
  try{
    const token = req.headers.authorization.split(' ')[1];
    //console.log("token = ", req.headers.authorization.split(' ')[1]);
    const decoded = jwt.verify(token, 'process.env.JWT_KEY');

    console.log("decoded = ", decoded);
    //req.body.userData = decoded;
    next();
  }catch(error){
    console.log(" error in check-auth = ", error);
    return res.status(401).json({
      message: 'Auth Failed in check-auth'
    })
  }
};
