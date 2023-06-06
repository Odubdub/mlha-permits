export const DataSource = {
    application: 0,
    author: 1,
    owner: 2,
    issuance: 3,
    other: 4
}

export const getFieldInfo = ({data, source, key}) => {
    
    const info = (source == DataSource.application)
  ? data.applicationDetails[key] : source == DataSource.author 
  ? data.applicationAuthor[key] : source == DataSource.owner 
  ? data.applicationOwner[key] : source == DataSource.owner 
  ? data.applicationOwner[key] : '##Implement this source##'

  return info
}

//function that returns substring between two strings
export const getSubstring = ({str, start, end}) => {
    let result = str.substring(str.indexOf(start) + start.length, str.indexOf(end))
    return result
}

export const getFieldValue = ({data, path}) => {
  
  let keys
  //Check if path contains a wildcard
  if (path.includes('%')) {
    keys = path.split('%')
    const wildcardKey = getFieldValueFromPath({data, path: keys[1]})
    const newPath = `${keys[0]}${wildcardKey}${keys[2]}`

    return getFieldValue({data, path: newPath})
  } else {
    return getFieldValueFromPath({data, path})
  }
}

export const getFieldValueFromPath = ({data, path}) => {

  const keys = path.split('.')
  
  let fieldData = data
  keys.forEach(key => {

    if (!fieldData) {
      console.log('Data not found at path', key +" "+ path)
      return 'No Data'
    } else {
      fieldData = fieldData[key]
    }
  })


  return fieldData
}