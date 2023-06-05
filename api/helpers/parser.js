const getFieldValue = (data, path, defaultValue) => {
    
    const keys = path.split('.')
    let fieldData = data
    keys.forEach(key => {
  
      if (!fieldData) {
        console.log('Data not found at path', path)
        return defaultValue || null
      } else {
        fieldData = fieldData[key]
      }
    })

    return fieldData
}

const getObject = (value) => {
    
  console.log(value);

  return typeof value === 'string' ? JSON.parse(value) : value
}

const getApplicationData = (body) => {

  const payload = forceParse(body.data, true);

  return {
    ...payload,
    service: forceParse(payload.service),
    form: forceParse(payload.form),
    profile: forceParse(payload.profile),
    submitted_by: forceParse(payload.submitted_by),
    payment: forceParse(payload.payment),
    service: forceParse(payload.service)
  }
}

const forceParse = (data, log) => {

  if (typeof data === 'string') {
    console.log('is string')
  var deserializedJsonString = data
  .replace(/(\\n)/g, "")
  .replace(/(\\r)/g, "")
  .replace(/(\\t)/g, "")
  .replace(/(\\f)/g, "")
  .replace(/(\\b)/g, "")
  .replace(/(\")/g, "\"")
  .replace(/("{)/g, "{")
  .replace(/(}")/g, "}")
  .replace(/(\\)/g, "")
  .replace(/(\/)/g, "/")
  .replace(/(}")/g, "}");

  const parsed = JSON.parse(deserializedJsonString)
    if (log) {
      console.log('serialized = ',data);
      console.log('deserialized = ',JSON.stringify(parsed, null, 2));
    }
  return parsed;
  }

  return data;
}

module.exports =  {getFieldValue, getObject, forceParse, getApplicationData}