import React, { useContext, useEffect, useRef, useState } from 'react';
import {
  OutlinedInput,
  InputLabel,
  MenuItem,
  FormControl,
  Typography,
  ListItemText,
  Select,
  Box,
  Button,
  Checkbox,
  TextField,
  Chip,
  FormControlLabel,
  Switch,
  Collapse,
  Stack,
  IconButton
} from '@mui/material';
import Iconify from 'src/components/Iconify';
import { EditorMode } from '../EditorMode';
import { LoadingButton } from '@mui/lab';
import { AuthorityContext } from 'src/layouts/dashboard/NewSidebar.js/AuthorityContext';
import { isBlank } from 'src/helperFuntions';
import { postToServer, putInServer } from 'src/ApiService';
import SignatureModal from './Signature';
import { set } from 'date-fns';

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250
    }
  }
};

export default function UserForm({
  editorMode = EditorMode.create,
  close,
  onReload,
  user,
  roles,
  department
}) {
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({ id: false, position: false, office: false, roles: false });
  const isSave = useRef(false);
  const { authority } = useContext(AuthorityContext);
  const [editing, setEditing] = useState(
    editorMode.view
      ? user
      : {
          active: true,
          hasSignature: false,
          roles: [],
          scope: [],
          idNo: '',
          designation: '',
          email: ''
        }
  );
  const otherRoles = useRef([]);
  const [showSignturePad, setShowSignturePad] = useState(false);
  const [showSignatureButton, setShowSignatureButton] = useState(false);
  const [responseError, setResponseError] = useState(null);
  const signatureRoles = roles
    .filter((role) => role.permissions.includes('approve-application'))
    .map((role) => role._id);

  const hasChanges = () => {
    return (
      user.email != editing.email ||
      user.designation != editing.designation ||
      user.scope != editing.scope ||
      user.roles != editing.roles ||
      user.active != editing.active
    );
  };

  const save = () => {
    setResponseError(null);
    if (hasNoErrors()) {
      isSave.current = true;

      const sign = {};
      if (editing.hasSignature) {
        sign.signature = editing.signature;
      }

      if (user != null) {
        //Update user

        const updated = [...editing.roles, ...otherRoles.current];
        console.log(updated);

        putInServer({
          path: `authority/admin-users/${user._id}`,
          params: {
            designation: editing.designation,
            email: editing.email,
            idType: user.idType,
            idNumber: user.idNumber,
            roles: updated,
            ...sign
          },
          onComplete: (res) => {
            onReload();
            close();
          },
          onError: (error) => {
            console.log(error);
            setResponseError(error.response.data.message);
          }
        });
      } else {
        //create user
        console.log('Create User');
        postToServer({
          path: 'authority/admin-users',
          params: {
            ...editing,
            type: 'admin',
            department: department._id,
            idNumber: editing.idNo,
            signature: editing.hasSignature,
            ...sign
          },
          onComplete: (_) => {
            onReload();
            close();
          },
          onError: (error) => {
            setResponseError(error.response.data.message);
          }
        });
      }
    }
  };

  const hasNoErrors = () => {
    const errs = {};

    const required = ['idNo', 'designation', 'email'];

    required.forEach((r) => {
      if (isBlank(editing[r])) {
        errs[r] = true;
      }
    });

    if (editing['roles'].length == 0) {
      errs.roles = true;
    }

    if (
      !(editing.email || '').match(
        /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      )
    ) {
      errs.email = true;
    }

    setErrors(errs);

    return Object.keys(errs).length === 0;
  };

  const setEdit = (name, value) => {
    const nData = { ...editing };
    nData[name] = value;
    setEditing(nData);
  };

  const setSignature = (signature) => {
    // console.log(signature)
    // var a = document.createElement("a"); //Create <a>
    // a.href = signature; //Image Base64 Goes here
    // a.download = "signature.png"; //File name Here
    // a.click()
    setEditing({ ...editing, signature, hasSignature: true });
    setShowSignatureButton(false);
    setShowSignturePad(false);
  };

  const setRoles = (name, value) => {
    setEditing({ ...editing, [name]: value });

    let hasSignatureRequirement = false;

    if (!editing.hasSignature) {
      value.forEach((role) => {
        if (signatureRoles.includes(role)) {
          hasSignatureRequirement = true;
        }
      });
    }

    setShowSignatureButton(hasSignatureRequirement);
  };

  useEffect(() => {
    if (user != null) {
      const roleIDs = roles.map((r) => r._id);

      //function that returns user roles that are in the service roles
      const serviceRolesForUser = roleIDs.filter((r) => user.roles.includes(r));
      otherRoles.current = user.roles.filter((r) => !roleIDs.includes(r));

      setEditing({
        active: true,
        roles: serviceRolesForUser,
        scope: [],
        hasSignature: user.hasSignature || false,
        idNo: user.idNumber,
        designation: user.designation,
        email: user.email,
        name: `${user.foreNames} ${user.lastName}`
      });
    } else {
      otherRoles.current = [];
      setEditing({
        active: true,
        roles: [],
        scope: [],
        idNo: '',
        hasSignature: false,
        designation: '',
        email: ''
      });
    }

    console.log(user);
  }, [user]);

  // console.log(signatureRoles)
  // console.log(editing.roles)
  // console.log('rqsgntr ', requiresSignature())

  return (
    <Box display="flex" alignItems="center" justifyContent="center" height="100%">
      <Box
        sx={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        <Box
          sx={{
            bgcolor: 'white',
            borderRadius: 2,
            width: '100%',
            mx: 2,
            paddingBottom: 1,
            display: 'flex',
            alignItems: 'center',
            flexDirection: 'column'
          }}
        >
          <SignatureModal
            open={showSignturePad}
            onSave={setSignature}
            onClose={() => setShowSignturePad(false)}
          />
          <FormControl fullWidth>
            {editorMode == EditorMode.view && (
              <TextField
                id="outlined-basic"
                disabled
                value={editing.name}
                label="Admin Name"
                sx={{ mt: 1, mx: 1 }}
                variant="outlined"
              />
            )}
            <TextField
              id="outlined-basic"
              error={errors.idNo}
              disabled={isLoading || editorMode === EditorMode.view}
              name="idNo"
              onChange={(e) => setEdit(e.target.name, e.target.value)}
              value={editing.idNo}
              placeholder="123456789"
              label="Identity Number"
              sx={{ mt: 1, mx: 1 }}
              variant="outlined"
            />
            <TextField
              id="outlined-basic"
              error={errors.designation}
              onChange={(e) => setEdit(e.target.name, e.target.value)}
              name="designation"
              disabled={isLoading}
              value={editing.designation}
              label="Designation"
              placeholder="Chief Operations Officer"
              sx={{ mt: 1, mx: 1 }}
              variant="outlined"
            />
            <TextField
              id="outlined-basic"
              error={errors.email}
              onChange={(e) => setEdit(e.target.name, e.target.value)}
              disabled={isLoading}
              name="email"
              value={editing.email}
              label="Email"
              placeholder={`${authority.shortTitle.toLowerCase()}.admin@gov.bw`}
              sx={{ mt: 1, mx: 1 }}
              variant="outlined"
            />
          </FormControl>
          <Box sx={{ mt: 1, mx: 1, width: '100%', px: 1 }}>
            <FormControl fullWidth>
              <InputLabel error={errors.roles} id="demo-multiple-checkbox-label" width={5}>
                Roles
              </InputLabel>
              <Select
                labelId="demo-multiple-checkbox-label"
                id="demo-multiple-checkbox"
                label="Roles"
                error={errors.roles}
                name="roles"
                multiple
                disabled={isLoading}
                value={editing.roles || []}
                onChange={(e) => setRoles(e.target.name, e.target.value)}
                input={<OutlinedInput label="Roles" />}
                renderValue={(selected) => (
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                    {selected.map((value) => (
                      <Chip key={value} label={roles.find((r) => value == r._id).name} />
                    ))}
                  </Box>
                )}
                MenuProps={MenuProps}
              >
                {roles.map((role, i) => {
                  return (
                    <MenuItem key={i} value={role._id}>
                      <Checkbox checked={(editing.roles || []).includes(role._id)} />
                      <ListItemText primary={role.name} />
                    </MenuItem>
                  );
                })}
              </Select>
            </FormControl>
          </Box>
          {responseError && (
            <Stack>
              <Chip
                sx={{ bgcolor: 'red', color: '#fff', mt: 2, textTransform: 'uppercase' }}
                label={responseError}
              />
            </Stack>
          )}
          {editorMode === EditorMode.create && (
            <Box display="flex" flexDirection="row" justifyContent="end" width="100%">
              {showSignatureButton ? (
                <LoadingButton
                  variant="contained"
                  onClick={() => setShowSignturePad(true)}
                  loading={isLoading}
                  loadingPosition="end"
                  centerRipple
                  endIcon={<Iconify icon="charm:arrow-right" />}
                  sx={{ marginTop: 2, marginRight: 1.5, alignSelf: 'end', justifySelf: 'end' }}
                >
                  Set Signature
                </LoadingButton>
              ) : (
                <LoadingButton
                  variant="contained"
                  onClick={() => save()}
                  loading={isLoading}
                  loadingPosition="end"
                  centerRipple
                  endIcon={<Iconify icon="charm:arrow-right" />}
                  sx={{ marginTop: 2, marginRight: 1.5, alignSelf: 'end', justifySelf: 'end' }}
                >
                  Assign User
                </LoadingButton>
              )}
            </Box>
          )}
          {editorMode === EditorMode.view && hasChanges() && (
            <Stack direction="row" justifyContent="end" width="100%" alignSelf="end">
              <Box
                display="flex"
                alignItems="center"
                flexDirection="row"
                justifyContent="end"
                width="100%"
              >
                {!showSignatureButton && (
                  <LoadingButton
                    sx={{ marginTop: 2 }}
                    startIcon={<Iconify icon="teenyicons:scribble-solid" />}
                    onClick={() => setShowSignturePad(true)}
                  >
                    {editing.hasSignature ? 'Edit Signature' : 'Set Signature'}
                  </LoadingButton>
                )}
                <Box flex="1" />
                <LoadingButton
                  variant="contained"
                  onClick={() => close()}
                  loading={isLoading}
                  loadingPosition="end"
                  centerRipple
                  endIcon={<Iconify icon="bi:x" />}
                  sx={{
                    marginTop: 2,
                    marginRight: 1.5,
                    alignSelf: 'end',
                    bgcolor: 'red',
                    '&:hover': { bgcolor: '#ff000080' },
                    justifySelf: 'end'
                  }}
                >
                  Cancel
                </LoadingButton>
                {showSignatureButton ? (
                  <LoadingButton
                    variant="contained"
                    onClick={() => setShowSignturePad(true)}
                    loading={isLoading}
                    loadingPosition="end"
                    centerRipple
                    endIcon={<Iconify icon="charm:arrow-right" />}
                    sx={{ marginTop: 2, marginRight: 1.5, alignSelf: 'end', justifySelf: 'end' }}
                  >
                    Set Signature
                  </LoadingButton>
                ) : (
                  <LoadingButton
                    variant="contained"
                    onClick={() => save()}
                    loading={isLoading}
                    loadingPosition="end"
                    centerRipple
                    endIcon={<Iconify icon="charm:arrow-right" />}
                    sx={{ marginTop: 2, marginRight: 1.5, alignSelf: 'end', justifySelf: 'end' }}
                  >
                    Update
                  </LoadingButton>
                )}
              </Box>
            </Stack>
          )}
        </Box>
      </Box>
    </Box>
  );
}
