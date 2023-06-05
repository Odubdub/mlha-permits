const Role = require("../models/access/Role");
const rolesConfig = require("../helpers/roles-config");

// a function to generate roles for a service
async function generateRolesForService(service) {
  const rolePermissions = rolesConfig.ROLES_MAP;
  const serviceRoles = rolesConfig.SERVICE_ONLY_ROLES;

  for (let i = 0; i < serviceRoles.length; i++) {
    console.log(i)
    const roleObj = {
      scope: 'Service',
      scopeRef: service._id,
      code: serviceRoles[i],
      description: `${service.name} ${serviceRoles[i]}`,
      name: serviceRoles[i].replace(/-/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase()),
      resourcePermissions: rolePermissions[serviceRoles[i]].resourcePermissions
    }

    // check if role already exists
    const role = await Role.findOne({ code: roleObj.code, scopeRef: roleObj.scopeRef });
    
    if (role) {
      console.log(`Role ${roleObj.code} already exists`);
    } else {
      console.log('Role does not exist');
      // const newRole = new Role(roleObj);
      // await newRole.save();
      // console.log(`Role ${roleObj.code} created`);
    }
  }
}







function generateRoles(service, department, role) {
  const roleName = `${service.code}-${department.code}-${role}`;
  const roleDescription = `${service.name} ${department.name} ${role}`;

  return new Promise((resolve, reject) => {
    Role.create({
      code: roleName,
      name: roleDescription,
      description: roleDescription,
      scopeRef: department._id,
      scope: 'Department',
      resourcePermissions: {}
    }, (err, role) => {
      if (err) return reject(err);
      resolve(role);
    });
  })

  
  // const rolePermissions = {
  //   Permit: {
  
}

module.exports = {
  generateRolesForService,
  generateRoles
};