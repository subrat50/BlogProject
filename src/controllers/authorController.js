const authorModel = require("../models/authorModel")
const AuthorModel = require("../models/authorModel")


// =========[ Create Authors API]============

const createAuthor = async function (req, res) {
    try {
        let author = req.body
        if(!author.fname) return res.status(400).send({status:false, msg: "first name is required"})
        
        if(author.fname !== String) return res.status(400).send({status:false, msg: "first name is invalid"})

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



module.exports.createAuthor = createAuthor