#!/bin/bash
set -e

mongosh <<EOF
use $MONGO_INITDB_DATABASE

db.createUser({
  user: '$MONGO_INITDB_ROOT_USERNAME',
  pwd: '$MONGO_INITDB_ROOT_PASSWORD',
  roles: [{
    role: 'dbOwner',
    db: '$MONGO_INITDB_DATABASE'
  }]
})
EOF