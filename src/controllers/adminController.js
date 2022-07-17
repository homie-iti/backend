// const mongoose = require("mongoose");
// require("../models/adminModel");

// let Admin = mongoose.model("admins");

// const bcrypt = require("bcrypt");

// const saltRounds = 10;

// // Get All Admins
// module.exports.getAllAdmins = (request, response, next) => {
//   Admin.find({})
//     .then((data) => {
//       response.status(200).json(data);
//     })
//     .catch((error) => {
//       next(error);
//     });
// };

// // Get Admin By ID
// module.exports.getAdminByID = (request, response, next) => {
//   Admin.findOne({ _id: request.params.id })
//     .then((data) => {
//       if (data == null) next(new Error(" Admin not found"));
//       response.status(200).json(data);
//     })
//     .catch((error) => {
//       next(error);
//     });
// };

// // Create Admin
// module.exports.createAdmin = (request, response, next) => {
//   let object = new Admin({
//     fullName: request.body.fullName,
//     age: request.body.age,
//     email: request.body.email,
//     password: bcrypt.hashSync(req.body.password, saltRounds),
//     phone: request.body.phone,
//     national_id: request.body.national_id,
//     image: request.body.image,
//   });
//   object
//     .save()
//     .then((data) => {
//       response.status(201).json({ data: "added" });
//     })
//     .catch((error) => next(error));
// };

// // Update Admin By ID
// module.exports.updateAdmin = (request, response, next) => {
//   // console.log(request.body.id);
//   Admin.findById(request.body.id)
//     .then((data) => {
//       for (const key in request.body) {
//         data[key] = request.body[key];
//       }
//       data.save();
//       response.status(200).json({ data: "updated" });
//     })
//     .catch((error) => {
//       next(error);
//     });
// };

// // Delete Admin By ID
// module.exports.deleteAdmin = (request, response, next) => {
//   Admin.deleteOne({ _id: request.params.id })
//     .then((data) => {
//       if (!data) {
//         next(new Error(" Admin not found"));
//       } else {
//         response.status(200).json({ data: "deleted" });
//       }
//     })
//     .catch((error) => {
//       next(error);
//     });
// };
