module.exports.deleteOneDocument = async (
    Model,
    selectionField,
    selectionValue,
    dataToReturn
) => {
    await Model.deleteOne({ [selectionField]: selectionValue })
    return dataToReturn
}

module.exports.deleteManyDocumentsByOneValue = async (
    Model,
    selectionField,
    selectionValue,
    dataToReturn
) => {
    await Model.deleteMany({ [selectionField]: selectionValue })
    return dataToReturn
}

module.exports.deleteManyDocumentsByManyValues = async (
    Model,
    selectionField,
    selectionValue,
    dataToReturn
) => {
    await Model.deleteMany({ [selectionField]: { $in: selectionValue } })
    return dataToReturn
}

module.exports.deleteArrayFieldElementsByManyValues = async (
    Model,
    selectionField,
    selectionValue,
    arrayField,
    arrayValue,
    dataToReturn
) => {
    await Model.updateOne(
        { [selectionField]: selectionValue },
        {
            $pull: {
                [arrayField]: { $in: arrayValue },
            },
        }
    )
    return dataToReturn
}

exports.updateOneDocument = async (
    Model,
    selectionField,
    selectionValue,
    modificationsObject,
    dataToReturn
) => {
    await Model.updateOne(
        { [selectionField]: selectionValue },
        modificationsObject
    )
    return dataToReturn
}
