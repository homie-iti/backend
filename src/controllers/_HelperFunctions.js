module.exports.deleteOneDocument = async (
    Model,
    field,
    value,
    dataToReturn
) => {
    await Model.deleteOne({ [field]: value })
    return dataToReturn
}

module.exports.deleteManyDocumentsByOneValue = async (
    Model,
    field,
    value,
    dataToReturn
) => {
    await Model.deleteMany({ [field]: value })
    return dataToReturn
}

module.exports.deleteManyDocumentsByManyValues = async (
    Model,
    field,
    value,
    dataToReturn
) => {
    await Model.deleteMany({ [field]: { $in: value } })
    return dataToReturn
}
