import { nanoid } from 'nanoid';
import { FieldTypes } from './constants';

export const sanitizeForm = (formFields) => {
  const modifiedForm = formFields.map((field) => {
    // Set an identifier for the field
    const f = {
      ...field,
      id: nanoid(16)
    };

    // Set the default size of the field
    if (f.fieldType == FieldTypes.DataTable) {
      // For the table fields take full width
      if (!f.breakpoints) {
        f.breakpoints = {
          xs: 12,
          sm: 12,
          md: 12,
          lg: 12
        };
      }
    } else {
      // Any other field should comform to the default size
      if (!f.breakpoints) {
        f.breakpoints = {
          xs: 12,
          sm: 12,
          md: 6,
          lg: 6
        };
      }
    }

    if (f.fieldType == FieldTypes.DataTable) {
      const tableFields = [...Object.values(f.dataTableData.inputData)];

      f.fields = tableFields.map((tf) => ({
        ...tf,
        id: nanoid(16),
        fieldType: tf['Field Type'],
        fieldName: tf['Column Key'],
        fieldLabel: tf['Column Name'],
        fieldType: tf['Field Type'] || FieldTypes.ShortText,
        options: tf['Options'] || '',
        endpoint: tf['Endpoint'] || '',
        hint: tf.hint || ''
      }));
      f.limit = f.dataTableData.limit;
      f.isLimited = f.dataTableData.isLimited;
    }

    return f;
  });

  return modifiedForm;
};
