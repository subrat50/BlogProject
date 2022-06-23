const authorModel = require("../models/authorModel")


// =========[ Create Authors API]============

const createAuthor = async function (req, res) {
    try {
        let author = req.body
        let {fname,lname}=author
        
        if(!fname) return res.status(400).send({status:false, msg: "first name is required"})
        if(typeof fname !==String) return res.status(400).send({status:false,msg:"first name is not valid "})
        
        

        if(!author.lname) return res.status(400).send({status:false, msg: "last name is required"})
        if(author.lname !== String) return res.status(400).send({status:false, msg: "last name is invalid"})

        if(!author.title) return res.status(400).send({status:false, msg: "title is required"})
        if(author.title !== String ) return res.status(400).send({status:false, msg: "title is invalid"})
       
        if(!author.email) return res.status(400).send({status:false, msg: "email is required"})
        if(author.email === String  ) return res.status(400).send({status:false, msg: "email name is invalid"})

        if(!author.password) return res.status(400).send({status:false, msg: "password is required"})


        let authorCreated = await AuthorModel.create(author)
        res.status(201).send({ status: true, data: authorCreated })
    } catch (err) {
        res.status(500).send({ status: false, msg: err.message })
    }
}
const loginUser = async function (req, res) {
    try{
    let userName = req.body.emailId;
    let password = req.body.password;
  
    let user = await authorModel.findOne({ emailId: userName, password: password });
    if (!user)
      return res.status(401).send({
        status: false,
        msg: "username or the password is not corerct",
      });
  
    // Once the login is successful, create the jwt token with sign function
    // Sign function has 2 inputs:
    // Input 1 is the payload or the object containing data to be set in token
    // The decision about what data to put in token depends on the business requirement
    // Input 2 is the secret
    // The same secret will be used to decode tokens
    let token = jwt.sign(
      {
        userId: user._id.toString(),
        batch: "Radon",
        organisation: "FunctionUp",
      },
      "Radon-project-1"
    );
    res.setHeader("x-auth-token", token);
    res.status(200).send({ status: true, token: token });
    }
    catch{
      console.log("this is the err:",err.messege)
      res.send({msg:"Error",err:err.messege})
    }
  };


module.exports.createAuthor = createAuthor