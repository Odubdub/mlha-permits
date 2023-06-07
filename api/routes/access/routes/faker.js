const generateRandomFutureDate = (minDaysAhead) => {
    var currentDate = new Date();
  
    // Set the minimum and maximum number of days to add to the current date
    var minDaysToAdd = minDaysAhead; // Change this value to set the minimum number of days
    var maxDaysToAdd = 600; // Change this value to set the maximum number of days
    
    // Generate a random number of days to add within the range
    var daysToAdd = Math.floor(Math.random() * (maxDaysToAdd - minDaysToAdd + 1)) + minDaysToAdd;
    
    var futureDate = new Date(currentDate.getTime() + (daysToAdd * 24 * 60 * 60 * 1000));
    
    // Get the year, month, and day from the future date
    var year = futureDate.getFullYear();
    var month = futureDate.getMonth() + 1; // Months are zero-based
    var day = futureDate.getDate();
    
    // Format the date as "YYYY-MM-DD"
    
    return futureDate;
  }

  module.exports = {
    generateRandomFutureDate
    }