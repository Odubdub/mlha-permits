//function that replaces occurances of _ with spaces
export const replaceHyphens = (str) => {
  return str.replace(/-/g, ' ');
}

//function that replaces occurances of _ with spaces
export const replaceAllUnderscores = (str) => {
  if (!str){
    return ''
  }
  return str.replace(/_/g, ' ');
}

//function that capitalizes the first letter of each word
export const capitalize = (str) => {
  return str.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
}

//Remove mlgrd from the service name
export const cleanString = (str) => {
  
  //replace mlgrd with empty string
  str = str.replace('miti botc', '')
  str = str.replace('mlgrd la', '')

  return str
}
