// Permissions consts
const FIND = 'find';
const COUNT = 'count';
const UPDATE = 'update';
const CREATE = 'create';
const DELETE = 'delete';
const FIND_ONE = 'findone';
const VERIFY_PERMIT = 'verify';
const ENDORSE_PERMIT = 'endorse';
const APPROVE_PERMIT = 'approve';

// Roles consts
const SUPER_ADMIN = 'super-admin';
const SERVICE_HEAD = 'service-head';
const SERVICE_ADMIN = 'service-admin';
const SERVICE_OFFICER = 'service-officer';
const DEPARTMENT_ADMIN = 'department-admin';

// Roles lists
const SUPER_USER_ROLES = [ SUPER_ADMIN ];
const DEPARTMENT_ONLY_ROLES = [ DEPARTMENT_ADMIN ];
const SERVICE_ONLY_ROLES = [ SERVICE_HEAD, SERVICE_ADMIN, SERVICE_OFFICER ];

const ROLES_MAP = {
  [SERVICE_OFFICER]: {
    resourcePermissions: {
      Permit: {
        [FIND]: true,
        [UPDATE]: true,
        [CREATE]: false,
        [DELETE]: false,
        [FIND_ONE]: true,
        [VERIFY_PERMIT]: true,
        [ENDORSE_PERMIT]: false,
        [APPROVE_PERMIT]: false
      },
      AdminUsers: {
        [FIND]: true,
        [CREATE]: false,
        [UPDATE]: false,
        [DELETE]: false,
        [FIND_ONE]: true,
      },
      Role: {
        [FIND]: true,
        [CREATE]: false,
        [UPDATE]: false,
        [DELETE]: false,
        [FIND_ONE]: true,
      },
      Ministry: {
        [FIND]: false,
        [CREATE]: false,
        [UPDATE]: false,
        [DELETE]: false,
        [FIND_ONE]: true,
      },
      Department: {
        [FIND]: false,
        [CREATE]: false,
        [UPDATE]: false,
        [DELETE]: false,
        [FIND_ONE]: true,
      },
      Service: {
        [FIND]: true,
        [CREATE]: false,
        [UPDATE]: false,
        [DELETE]: false,
        [FIND_ONE]: true
      }
    }
  },
  [SERVICE_HEAD]: {
    resourcePermissions: {
      Permit: {
        [FIND]: true,
        [UPDATE]: true,
        [CREATE]: false,
        [DELETE]: false,
        [FIND_ONE]: true,
        [VERIFY_PERMIT]: false,
        [ENDORSE_PERMIT]: true,
        [APPROVE_PERMIT]: true
      },
      AdminUsers: {
        [FIND]: true,
        [CREATE]: true,
        [UPDATE]: true,
        [DELETE]: true,
        [FIND_ONE]: true
      },
      Role: {
        [FIND]: true,
        [CREATE]: true,
        [UPDATE]: true,
        [DELETE]: true,
        [FIND_ONE]: true
      },
      Ministry: {
        [FIND]: true,
        [CREATE]: false,
        [UPDATE]: false,
        [DELETE]: false,
        [FIND_ONE]: true
      },
      Department: {
        [FIND]: true,
        [CREATE]: false,
        [UPDATE]: false,
        [DELETE]: false,
        [FIND_ONE]: true
      },
      Service: {
        [FIND]: true,
        [CREATE]: false,
        [UPDATE]: true,
        [DELETE]: false,
        [FIND_ONE]: true
      }
    }
  },
  [SERVICE_ADMIN]: {
    resourcePermissions: {
      Permit: {
        [FIND]: false,
        [UPDATE]: false,
        [CREATE]: false,
        [DELETE]: false,
        [FIND_ONE]: false,
        [VERIFY_PERMIT]: false,
        [ENDORSE_PERMIT]: false,
        [APPROVE_PERMIT]: false
      },
      AdminUsers: {
        [FIND]: true,
        [CREATE]: true,
        [UPDATE]: true,
        [DELETE]: true,
        [FIND_ONE]: true
      },
      Role: {
        [FIND]: true,
        [CREATE]: true,
        [UPDATE]: true,
        [DELETE]: true,
        [FIND_ONE]: true
      },
      Ministry: {
        [FIND]: true,
        [CREATE]: false,
        [UPDATE]: false,
        [DELETE]: false,
        [FIND_ONE]: true
      },
      Department: {
        [FIND]: true,
        [CREATE]: false,
        [UPDATE]: false,
        [DELETE]: false,
        [FIND_ONE]: true
      },
      Service: {
        [FIND]: true,
        [CREATE]: false,
        [UPDATE]: true,
        [DELETE]: false,
        [FIND_ONE]: true
      }
    }
  },
  [DEPARTMENT_ADMIN]: {
    resourcePermissions: {
      Permit: {
        [FIND]: false,
        [UPDATE]: false,
        [CREATE]: false,
        [DELETE]: false,
        [FIND_ONE]: false,
        [VERIFY_PERMIT]: false,
        [ENDORSE_PERMIT]: false,
        [APPROVE_PERMIT]: false
      },
      AdminUsers: {
        [FIND]: true,
        [CREATE]: true,
        [UPDATE]: true,
        [DELETE]: true,
        [FIND_ONE]: true
      },
      Role: {
        [FIND]: true,
        [CREATE]: true,
        [UPDATE]: true,
        [DELETE]: true,
        [FIND_ONE]: true
      },
      Ministry: {
        [FIND]: true,
        [CREATE]: false,
        [UPDATE]: false,
        [DELETE]: false,
        [FIND_ONE]: true
      },
      Department: {
        [FIND]: true,
        [CREATE]: false,
        [UPDATE]: true,
        [DELETE]: false,
        [FIND_ONE]: true
      },
      Service: {
        [FIND]: true,
        [CREATE]: true,
        [UPDATE]: true,
        [DELETE]: false,
        [FIND_ONE]: true
      }
    }
  },
  [SUPER_ADMIN]: {
    resourcePermissions: {
      Permit: {
        [FIND]: false,
        [UPDATE]: false,
        [CREATE]: false,
        [DELETE]: false,
        [FIND_ONE]: false,
        [VERIFY_PERMIT]: false,
        [ENDORSE_PERMIT]: false,
        [APPROVE_PERMIT]: false
      },
      AdminUsers: {
        [FIND]: true,
        [CREATE]: true,
        [UPDATE]: true,
        [DELETE]: true,
        [FIND_ONE]: true
      },
      Role: {
        [FIND]: true,
        [CREATE]: true,
        [UPDATE]: true,
        [DELETE]: true,
        [FIND_ONE]: true
      },
      Ministry: {
        [FIND]: true,
        [CREATE]: true,
        [UPDATE]: true,
        [DELETE]: true,
        [FIND_ONE]: true
      },
      Department: {
        [FIND]: true,
        [CREATE]: true,
        [UPDATE]: true,
        [DELETE]: true,
        [FIND_ONE]: true
      },
      Service: {
        [FIND]: true,
        [CREATE]: true,
        [UPDATE]: true,
        [DELETE]: true,
        [FIND_ONE]: true
      },

    }
  }
}

module.exports = {
  ROLES_MAP,
  SUPER_USER_ROLES,
  SERVICE_ONLY_ROLES,
  DEPARTMENT_ONLY_ROLES
}
