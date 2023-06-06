import { DefaultPermissions } from "../Config/roles/RoleForm"

export const getRoles = (user) => {
    
    const roles = user.roles || []
}

export const canRequestPayment = (user) => {

    const roles = getRoles(user)
    return roles.includes(DefaultPermissions.payment.type)
}

export const canReturnForm = (user) => {
    
    const roles = getRoles(user)
    return roles.includes(DefaultPermissions.return.type)
}

export const canIssueCertificate = (user) => {
        
    const roles = getRoles(user)
    return roles.includes(DefaultPermissions.issue.type)
}

export const canRejectApplication = (user) => {
                
    const roles = getRoles(user)
    return roles.includes(DefaultPermissions.reject.type)
}


export const canPeformAction = (user, action, service) => {
    
    const roles = getRoles(user)
    return true
}