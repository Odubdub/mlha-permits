export const validateEmail = (value) => {

    var validRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
  
    if (value.match(validRegex)) {
      return true
    } else {
      return false
    }
  }