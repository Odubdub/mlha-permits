import {  useRef, useState } from 'react';
import { LoadingButton } from '@mui/lab';
import {
  Stack,
  Box
} from '@mui/material';
import './input.css';
import { FieldViewer } from 'src/bundle/FieldViewer'
import { post, url } from 'src/ApiService'
import RegisterFormFields from './register-form.json'
import SecondSection from './register-contact-form.json'
import ThirdSection from './register-password.json'
import Iconify from 'src/bundle/Iconify'
import { updateToken } from './AuthService'
import jwtDecode from 'jwt-decode'
import { useContext } from 'react'
import { AuthContext } from 'src/AuthContext'

export default function RegisterForm({onStartLoad, onStopLoad, setAuthError, setToken}) {

  const [shownSection, setShownSection] = useState(0);
  const { setUserData } = useContext(AuthContext);

  const registerRef = useRef(null);
  const [data, setData] = useState({})
  const [errors, setErrors] = useState({});
  const [sectionErrors, setSectionErrors] = useState({});
  const [openSection, setOpenSection] = useState(0);

  const [isSubmitting, setIsSubmitting] = useState(false);

  const isValidThirdSection = () => {
    
    if (Object.keys(errors).length == 0 && data.password == data.confirmPassword) {
      return true;
    }
  };

  const register = async () => {
    onStartLoad();
    post('access-control/auth-customer/register', data)
    .then((response) => {
      setIsSubmitting(false);
      const token = response.token;
      
      updateToken(token);
      const decoded = jwtDecode(token);
      console.log(decoded);
      setUserData(decoded);
      onStopLoad();
    })
    .catch((error) => {
      setIsSubmitting(false);
      console.log(error.message);
    }
    );
  };



  return (
    <Stack>
      <FieldViewer
        ref={registerRef}
        data={data}
        host={url}
        setData={setData}
        maxHeight={650}
        height={600}
        errors={errors}
        setErrors={setErrors}
        openSection={openSection}
        setOpenSection={setOpenSection}
        setSectionErrors={setSectionErrors}
        sectionErrors={sectionErrors}
        sections={shownSection == 0 ? RegisterFormFields : shownSection == 1 ? SecondSection : ThirdSection}
      />
      <Box mx={2}>
      {
        shownSection == 0 &&
        <LoadingButton
          fullWidth
          size="large"
          type="submit"
          variant="contained"
          loadingPosition="end"
          disabled={Object.keys(errors).length > 0}
          endIcon={<Iconify icon="material-symbols:arrow-right-alt-rounded" />}
          loading={isSubmitting}
          onClick={() => setShownSection(1)}
        >
          Next
        </LoadingButton>}
        {
          shownSection == 1 && 
          <LoadingButton
          fullWidth
          size="large"
          type="submit"
          variant="contained"
          loadingPosition="end"
          disabled={Object.keys(errors).length > 0}
          endIcon={<Iconify icon="material-symbols:arrow-right-alt-rounded" />}
          loading={isSubmitting}
          onClick={() => setShownSection(2)}
        >
          Add Password Details
        </LoadingButton>
        }
        {
          shownSection == 2 && 
          <LoadingButton
          fullWidth
          size="large"
          type="submit"
          variant="contained"
          disabled={!isValidThirdSection()}
          loadingPosition="end"
          endIcon={<Iconify icon="material-symbols:arrow-right-alt-rounded" />}
          loading={isSubmitting}
          onClick={() => register()}
        >
          Create Account
        </LoadingButton>
        }
      </Box>
    </Stack>
  );
}
