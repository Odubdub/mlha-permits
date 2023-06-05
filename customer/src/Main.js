import React, { useContext, useEffect, useCallback, useState } from 'react';
import { Box, Grid, Stack, Card } from '@mui/material';
import { AuthContext } from './AuthContext';
import { UserDetails } from './User';
import { FieldForm } from './FieldForm';
import { RequestContext } from './RequestContext';
import { useNavigate } from 'react-router-dom';
import { getRegistrations } from './ApiService';
import sampleForm from './marriages-form.json';
import sampleData from './marriage-data.json';
import sampleMinistries from './sr-ministries.json';
import { FieldEditorContext } from './FieldEditorContext';
import { Header } from './Header';
import { Footer } from './Footer';
import { FieldViewer } from './bundle/FieldViewer';
import { sanitizeForm } from './bundle/sanitize';

export default function RegPage() {
  const { userData } = useContext(AuthContext);
  const [showRequestForm, setShowRequestForm] = useState(false);
  const [files, setFiles] = useState([]);

  // Forwarded state params
  const [sections, setSections] = useState([
    {
      title: 'No Form',
      description: 'No Subtitle',
      fields: []
    }
  ]);

  const [data, setData] = useState({});
  const [errors, setErrors] = useState({});
  const [selectedSection, setSelectedSection] = useState(0);
  const [openSection, setOpenSection] = useState(0);
  const [sectionErrors, setSectionErrors] = useState({});
  const [form, setForm] = useState([]);

  const navigate = useNavigate();

  const [previewForm, setPreviewForm] = useState(true);

  const editorValues = {
    data,
    setData,
    selectedSection,
    setSelectedSection,
    form,
    sections,
    setSections,
    setForm,
    previewForm,
    setPreviewForm,
    setErrors,
    errors
  };

  const { setCurrentRequest, setReadOnlyForm } = useContext(RequestContext);

  const [refreshKey, setRefreshKey] = useState(0);

  const onDrop = useCallback((acceptedFiles) => {
    // Do something with the files
    setShowRequestForm(true);
    setFiles(acceptedFiles);
    setReadOnlyForm(false);
    setCurrentRequest(null);
    setData({});
  }, []);

  const close = () => {
    setShowRequestForm(false);
    setFiles([]);
    setData({});
    setErrors({});
    setCurrentRequest(null);

    navigate('/');
  };

  useState(() => {
    if (sampleForm[0].title) {
      const inputSections = [...sampleForm];
      inputSections.forEach((section) => {
        section.fields = sanitizeForm(section.fields);
      });
      setSections(inputSections);
    } else if (Array.isArray(sampleForm)) {
      setSections([
        {
          title: 'No Title',
          description: 'No Description',
          fields: sanitizeForm(sampleForm)
        }
      ]);
    } else {
      setSections([
        {
          title: 'No Form',
          description: 'No Subtitle',
          fields: []
        }
      ]);
    }
  }, []);

  useEffect(() => {
    const ministries = [];
    const dependancies = [];
    sampleMinistries.forEach((ministry) => {
      ministries.push({
        key: ministry.code,
        value: ministry.name
      });
      dependancies.push({
        field: 'ministry',
        value: ministry.code,
        condition: 0,
        target: 'options',
        targetValue: ministry.departments.map((department) => ({
          value: department.name,
          key: department.code
        }))
      });
    });
    // console.log(dependancies);
    // console.log(ministries);
  }, []);

  useEffect(() => {
    const newData = { ...sampleData };

    // newData.ministry = newData.ministries_agencies;

    // sampleForm.forEach((section) => {
    //   section.fields.forEach((field) => {
    //     if (FieldTypes.DropdownMulti == field.fieldType) {
    //       if (Array.isArray(field.options) && typeof field.options[0] != 'string') {
    //         const value = getFieldValue({ data: newData, path: field.fieldName });
    //         if (Array.isArray(value)) {
    //           const options = field.options.filter((option) => value.includes(option.value));
    //           if (options.length > 0) {
    //             newData[field.fieldName] = options.map((option) => option.key);
    //           } else {
    //             const options = field.options.filter((option) => value.includes(option.value));
    //           }
    //         }
    //       } else {
    //         // String Options
    //       }
    //     } else if (FieldTypes.Dropdown == field.fieldType) {
    //       if (Array.isArray(field.options) && typeof field.options[0] != 'string') {
    //         const value = getFieldValue({ data: newData, path: field.fieldName });

    //         if (![null, undefined, ''].includes(value)) {
    //           const option = field.options.find(
    //             (option) => option.value == value || option.key == value
    //           );
    //           if (option) {
    //             if (field.fieldName.includes('payment.') && !newData.payment) {
    //               newData.payment = {};
    //               newData.payment[field.fieldName.split('.')[1]] = option.key;
    //             } else if (field.fieldName.includes('payment.')) {
    //               newData.payment[field.fieldName.split('.')[1]] = option.key;
    //             } else {
    //               newData[field.fieldName] = option.key;
    //             }
    //           } else if (typeof value != 'boolean') {
    //             const options = getDependancyValue({
    //               data: newData,
    //               field,
    //               dependancies: field.dependancies,
    //               property: 'options'
    //             });
    //             if (options) {
    //               const option = options.find((option) => option.value == value);
    //               if (option) {
    //                 newData[field.fieldName] = option.key;
    //               } else {
    //                 // console.log(`No Single ${field.fieldName} => ${value}`, options);
    //               }
    //             }
    //           }
    //         } else {
    //           // console.log(field.fieldName, ' -> No Value');
    //         }
    //       } else {
    //         // String Options
    //       }
    //     } else if (field.fieldType == FieldTypes.Endpoint) {
    //       let value = getFieldValue({ data: newData, path: field.fieldName });

    //       if (typeof value == 'string' && !value.startsWith('/')) {
    //         value = `/${value}`;
    //       }
    //       if (field.fieldName.includes('payment.') && !newData.payment) {
    //         newData.payment = {};
    //         newData.payment[field.fieldName.split('.')[1]] = value;
    //       } else if (field.fieldName.includes('payment.')) {
    //         newData.payment[field.fieldName.split('.')[1]] = value;
    //       } else {
    //         newData[field.fieldName] = value;
    //       }
    //     }
    //   });
    // });

    // sampleForm.forEach((section) => {
    //   section.fields.forEach((field) => {
    //     if ([FieldTypes.Dropdown, FieldTypes.DropdownMulti].includes(field.fieldType)) {
    //       newData[field.fieldName] = sanitizeDropDownValues(field, newData);
    //     }
    //   });
    // });

    // console.log(newData);
    setData(newData);
  }, [sampleForm]);

  useEffect(() => {
    //Get service data by serviceCode from api
    const arr = window.location.pathname.split('requests/');
    if (arr.length == 2) {
      const id = arr[1];
      getRegistrations(`requests/by-id/${id}`)
        .then((res) => {
          if (res.registeredBy == userData.preferred_username) {
            setCurrentRequest(res);
            setReadOnlyForm(true);
          }
        })
        .catch((error) => console.error('Error:', error));
    }
  }, [window.location.pathname]);

  return (
    <Box
      sx={{
        bgcolor: '#32C5FF0B',
        px: 3,
        height: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'start',
        flexDirection: 'column'
      }}
    >
      <Grid container spacing={1}>
        <Grid item xs={12} sm={12} md={3} lg={3}>
          <Box maxHeight="100vh" overflow="hidden">
            <UserDetails key={refreshKey} addNewRequest={() => {}} isAdmin={false} />
          </Box>
        </Grid>

        <Grid item xs={12} sm={12} md={9} lg={9}>
          <FieldEditorContext.Provider value={editorValues}>
            <Card
              sx={{ mt: 3, height: 'calc(100vh - 40px)' }}
              width="100%"
              children={
                <Stack
                  sx={{
                    width: '100%',
                    height: '100%',
                    borderWidth: '2px',
                    borderRadius: 2,
                    pt: 2
                  }}
                  children={
                    <>
                      <Header />
                      <Stack
                        flex={1}
                        minHeight="calc(100vh - 205px)"
                        maxHeight="calc(100vh - 205px)"
                      >
                        {previewForm ? (
                          <FieldViewer
                            data={data}
                            errors={errors}
                            minHeight="calc(100vh - 205px)"
                            maxHeight="calc(100vh - 205px)"
                            selectedSection={selectedSection}
                            sections={sections}
                            sectionErrors={sectionErrors}
                            openSection={openSection}
                            setOpenSection={setOpenSection}
                            setSectionErrors={setSectionErrors}
                            setErrors={setErrors}
                            setData={setData}
                          />
                        ) : (
                          <FieldForm
                            files={files}
                            editingForm={sections[selectedSection].fields}
                            data={data}
                            selectedSection={selectedSection}
                            sections={sections}
                            setData={setData}
                            onOpenMetadata={() => setShowRequestForm(true)}
                            setFiles={setFiles}
                            onClose={close}
                            errors={errors}
                          />
                        )}
                      </Stack>
                      <Footer />
                    </>
                  }
                />
              }
            />
          </FieldEditorContext.Provider>
        </Grid>
      </Grid>
    </Box>
  );
}
