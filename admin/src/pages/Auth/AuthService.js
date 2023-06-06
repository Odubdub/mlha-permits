const tokenKey = 'token'
const expirationKey = 'expiration'
const idKey = 'id'
export let bearerToken = ''


//2 hours in milliseconds
export const sessionLength = 1000 * 60 * 60 * 1
export const refreshPeriod = 1000 * 60 * 60 * 0.95

export const refreshLength = 20

export const updateToken = (token, exp, id) => {
    
    bearerToken = token

    var endDate = new Date(exp)
    var startdate = new Date(endDate)
    var durationInMinutes = 58
    startdate.setMinutes(endDate.getMinutes() - durationInMinutes)
    const expiration = new Date(exp)

    //calculate how long the token will be valid
    const expirationDate = expiration
    const now = new Date()
    const timeDiff = expirationDate.getTime() - now.getTime()
    const timeToExpire = timeDiff / 1000

    window.localStorage.setItem(tokenKey, token)
    window.localStorage.setItem(idKey, id)
    window.localStorage.setItem(expirationKey, expiration.toISOString())
}

export const getAuthParams = () => {

    const expiration = window.localStorage.getItem(expirationKey)
    const token = window.localStorage.getItem(tokenKey)
    const id = window.localStorage.getItem(idKey)
    if (token){
        bearerToken = token
    }

    if (expiration == null || token == null || id == null){
        return { expiration: '', token: '', id: '' }
    }
    return { expiration: expiration, token: token, id: id }
}

export const clearToken = () => {
    window.localStorage.removeItem(tokenKey)
    window.localStorage.removeItem(expirationKey)
    window.localStorage.removeItem(idKey)
}

//check if token is expired
export const isTokenExpired = () => {
    const authParams = getAuthParams()
    if (authParams == null){
        return true
    }
    const diff = (new Date(authParams.expiration)).getTime() - Date.now()
    const diffSeconds = Math.floor(diff / 1000)

    if (diffSeconds < 0){
        return true
    }
    return false
}

//Check if auth token should be refreshed
export const shouldRefreshToken = () => {
    const authParams = getAuthParams()
    if (authParams == null){
        return false
    }

    const diff = (new Date(authParams.expiration)).getTime() - Date.now()
    const diffSeconds = Math.floor(diff / 1000)
    console.log(`Refresh expires in ${diffSeconds} seconds`)

    if (diffSeconds < 60){
        return true
    }
    
    return false
}