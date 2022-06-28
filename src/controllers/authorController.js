// ==+==+==+==+==+==+==+==+==+==[Requirements]==+==+==+==+==+==+==+==+==+==

const authorModel = require("../models/authorModel")
const jwt = require("jsonwebtoken");

// ==+==+==+==[Validation Functions]==+==+==+==+=
const isValid = function (value) {
    if (typeof value === "undefined" || value === null) return false;
    if (typeof value === "string" && value.trim().length === 0) return false;
    if (typeof value === "string")
    return true;
};

const isValidTitle = function (title) {
  return ["Mr", "Mrs", "Miss"].indexOf(title) !== -1
}
const isvalidRequest=function(requestBody){
  return Object.keys(requestBody).length >0
}

// ==+==+==+==+==+==+==+==+==+==[Create Author]==+==+==+==+==+==+==+==+==+==

const createAuthor = async function (req, res) {
    try {
      const requestBody=req.body
      if(!isvalidRequest(requestBody)){
        return res.status(400).send({status:false,msg:"invalid request parameter ,please provied author detail"})
      }
        let { fname, lname, title, email, password } = requestBody

        if (!isValid(fname)) return res.status(400).send({ status: false, msg: "fname is Required" })

        if (!isValid(lname)) return res.status(400).send({ status: false, msg: "lname is Required" })

        if (!isValid(title)) return res.status(400).send({ status: false, msg: "title is Required" })

        if (!isValidTitle(title)) return res.status(400).send({ status: false, msg: "title is not as per requirement" })

        if (!isValid(password)) return res.status(400).send({ status: false, msg: "password is Required" })
        if (!isValid(email)) return res.status(400).send({ status: false, msg: "email is Required" })
        

        if (!(/^\w+([\.-]?\w+)@\w+([\.-]?\w+)(\.\w{2,3})+$/.test(email))) return res.status(400).send({ status: false, msg: "email Id is Invalid" })

        let Email = await authorModel.findOne( {email} )

        if (Email) return res.status(400).send({ status: false, msg: "email is already used" })
      //validation end
        if (requestBody) {
            let authorCreated = await authorModel.create(requestBody)
            res.status(201).send({ status: true, data: authorCreated, msg: "author successfully created" })
        } else res.send(400).send({ status: false,  msg: "bad request" })
    }
    catch (error) {
        console.log("Server Error:", error.message)
        res.status(500).send({ msg: "Server Error", error: error.message })
    }
}


// ==+==+==+==+==+==+==+==+==+==[Author Login]==+==+==+==+==+==+==+==+==+==

const loginAuthor = async function (req, res) {
    try {
      const requestBody=req.body
      if(!isvalidRequest(requestBody)){
        return res.status(400).send({status:false,msg:"invalid request parameter ,please provied author detail"})
      }
  
      let { email, password } = requestBody

      if (!isValid(email)) return res.status(400).send({ status: false, msg: "email is required" })

        if (!(/^\w+([\.-]?\w+)@\w+([\.-]?\w+)(\.\w{2,3})+$/.test(email))) return res.status(400).send({ status: false, msg: "email Id is invalid" })
        if(!isValid(password)) return res.status(400).send({status:false,msg:"password is required"})
        
        let author = await authorModel.findOne({email,password});

        if (!author)return res.status(401).send({status: false,msg: "invalid login crefential"});

      // ---------[Create Token JWT]---------
      let token = jwt.sign(
        {
          authorId: author._id.toString(),
          batch: "radon",                    //payload data
          organisation: "FunctionUp",
        },
        "Radon-project-1"                    //Secret Key
        )                   
      res.setHeader("x-api-key", token);
      res.status(201).send({ status: true, token: token , msg: "Login Successfully"});
    } catch (err) {
      res.status(500).send({ msg: "error", err: err.message });
    }
  };
// ==+==+==+==+==+==+==+==+==+==[Exports]==+==+==+==+==+==+==+==+==+==

module.exports.createAuthor = createAuthor
module.exports.loginAuthor = loginAuthor