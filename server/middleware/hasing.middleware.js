import bcrypt from 'bcrypt';

module.exports.encryption = async function encryption(req,res,next){
    let salt = await bcrypt.genSalt();
    let hasedString = await bcrypt.hash(req.body.Password,salt);
    req.body.Password = hasedString;
    next();
}