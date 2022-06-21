const AuthorModel = require("../models/authorModel")

// =========[ Create Authors API]============
const createAuthor = async function (req, res) {
    try {
        let author = req.body
        let authorCreated = await AuthorModel.create(author)
        res.status(201).send({ status: true, data: authorCreated })
    } catch (err) {
        res.status(500).send({ status: false, msg: err.message })
    }
}



module.exports.createAuthor = createAuthor

// const isValid = function(value)
// {
//     if(typeof value === 'undefined' || value === null){
//         return false
//     }
//     if(typeof value === 'string' && value.trim().length == 0){
//         return false
//     }
//     return true

// }

