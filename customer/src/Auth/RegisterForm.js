import * as Yup from 'yup';
import { useContext, useEffect, useRef, useState } from 'react';
import { useFormik, Form, FormikProvider } from 'formik';
import { LoadingButton } from '@mui/lab';
import {
  Stack,
  Typography,
  CircularProgress,
  Box
} from '@mui/material';
import { AuthContext } from 'src/AuthContext';
import './input.css';
import { FieldViewer } from 'src/bundle/FieldViewer'
import { url } from 'src/ApiService'
import RegisterFormFields from './register-form.json'
import Iconify from 'src/bundle/Iconify'

const email = 'email';
const sms = 'sms';

export default function RegisterForm({onStartLoad, onStopLoad}) {
  const [showPassword, setShowPassword] = useState(false);

  const registerRef = useRef(null);
  const [data, setData] = useState({})
  const [errors, setErrors] = useState({});
  const [sectionErrors, setSectionErrors] = useState({});
  const [openSection, setOpenSection] = useState(0);

  const [isSubmitting, setIsSubmitting] = useState(false);

  const [isPreloading] = useState(true);

  const [otp, setOtp] = useState('');
  const [showCode, setShowCode] = useState(false);

  const handleShowPassword = () => {
    setShowPassword((show) => !show);
  };


  const register = async () => {
  };

  return (
    <Stack>
      <FieldViewer
        ref={registerRef}
        data={data}
        host={url}
        setData={setData}
        maxHeight={500}
        height={500}
        errors={errors}
        setErrors={setErrors}
        openSection={openSection}
        setOpenSection={setOpenSection}
        setSectionErrors={setSectionErrors}
        sectionErrors={sectionErrors}
        sections={RegisterFormFields}
      />
                    
      <Box mx={2}>

        <LoadingButton
          fullWidth
          size="large"
          type="submit"
          variant="contained"
          loadingPosition="end"
          endIcon={<Iconify icon="material-symbols:arrow-right-alt-rounded" />}
          loading={isSubmitting}
          onClick={() => register()}
        >
          Sign in with 1Gov
        </LoadingButton>
      </Box>
    </Stack>
  );
}
