module.exports = {
    totalParkings : 120,
    maxWaitingTimeInMins: 30,
    minWaitingTimeInMins: 15,
    bookingHours: 9,
    joiValidationOptions: {
        abortEarly: false, 
        allowUnknown: false,
        stripUnknown: true 
    },
    mongoConnectionString: 'mongodb://localhost:27017/parking',
    

}