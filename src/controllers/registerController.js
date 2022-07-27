// const mongoose = require("mongoose");
// require("../models/userModel");
// require("../models/landlordModel");
// require("../models/agentModel");
// require("../models/userModel");
// let User = mongoose.model("users");
// const nodemailer = require("nodemailer");




// const transporter = nodemailer.createTransport({
//     host: 'smtp.ethereal.email',
//     port: 587,
//     auth: {
//         user: 'amir42@ethereal.email',
//         pass: 'kcrvUkEwYDsteN7Tg2'
//     }
// });




// module.exports.userSignUp = (request, response, next) => {
//     let object = new User(
//         //request.body
//         {
//             // _id: mongoose.Types.ObjectId(),
//             fullName: request.body.fullName,
//             age: request.body.age,
//             password: request.body.password,
//             gender: request.body.gender,
//             phone: request.body.phone,
//             national_id: request.body.national_id,
//             address: request.body.address,
//             email: request.body.email,
//             image: request.body.image,
//         }
//     );
//     object
//         .save()

//         .then((data) => {

//             let mailOptions = {
//                 from: '"Homie 👻" <amir42@ethereal.email>', // sender address
//                 to: data.email,// list of receivers
//                 subject: "Hello ", // Subject line
//                 text: "welcome to homie Project", // plain text body
//             };

//             transporter.sendMail(mailOptions, function (error, info) {
//                 if (error) {
//                     console.log(error);
//                 } else {
//                     console.log("sent");
//                 }
//             })

//             response.status(201).json({ data: "added" })
//         })
//         .catch((error) => next(error));
// };