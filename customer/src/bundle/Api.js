const { getFieldValue } = require('./DataTransformer');

export const generateDynamicURL = (url, data) => {
  let dynamicURL = url;

  // Extract parameter keys from the URL
  const paramKeys = dynamicURL.match(/\$[a-zA-Z0-9._-]+/g);
  // Replace named dynamic parameters in the URL
  if (paramKeys) {
    for (const paramKey of paramKeys) {
      const path = paramKey.substring(1);
      const paramValue = getFieldValue({ data, path });
      if (!paramValue) {
        return null;
      }

      if (paramValue === undefined) {
        return null;
      } else {
        dynamicURL = dynamicURL.replace(paramKey, paramValue);
      }
    }

    return dynamicURL;
  }

  return null;
};
