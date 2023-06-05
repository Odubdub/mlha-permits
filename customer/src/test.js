//fuction that fetches data api and returns a promise
// }
// */
export const fetchData = (url) => {
    return new Promise((resolve, reject) => {
        axios.get(url)
        .then(response => {
            resolve(response.data)
        })
        .catch(err=>{
            reject(err.message)
        })
    }
    )
}

const getHash = (str, algo = "SHA-256") => {
    let strBuf = new TextEncoder().encode(str);
    return crypto.subtle.digest(algo, strBuf)
      .then(hash => {
        window.hash = hash;
        // here hash is an arrayBuffer, 
        // so we'll connvert it to its hex version
        let result = '';
        const view = new DataView(hash);
        for (let i = 0; i < hash.byteLength; i += 4) {
          result += ('00000000' + view.getUint32(i).toString(16)).slice(-8);
        }
        return result;
      });
  } 

export const setupDebug = (sample, onShow) => {
    getHash(sample)
    .then(res=>{
      console.log('hash is: ', res)
        if (['7ac4df9696f2b4b6eb569b98a08829f2d930c491202b33580c50f38087ba17c2'].includes()){
            onShow()
        }
    })
    .catch(_=>{

    })
}