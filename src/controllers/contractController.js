let Contract = require("./../models/contractModel");
let Landlord = require("./../models/landlordModel");

module.exports.getLandlordContracts = (request, response, next) => {
  Contract.findOne({ "landlordId._id": request.params.id }, "landlordUnits")
    .then((data) => {
      console.log(data);
    })
    .catch((error) => next(error));
};

module.exports.getAllLandlords = (request, response, next) => {
  Landlord.find({})
    .then((data) => {
      response.status(200).json(data);
    })
    .catch((error) => next(error));
};
