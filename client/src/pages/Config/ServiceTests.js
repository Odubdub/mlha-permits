import axios from 'axios';
import { postToServer } from 'src/ApiService';

export const testSubmit = (application, code) => {
  postToServer({
    path: `applications/${code}`,
    params: application,
    onComplete: (data) => {
      console.log(data);
    },
    onError: (err) => {
      console.log(err);
    }
  });
};

export const updateForm = (host, form, onComplete) => {
  axios
    .patch(host + `services/config/form/${selectedService.id}`, {
      fields: form,
      profileData: [
        'first_name',
        'middle_name',
        'surname',
        'date_of_birth',
        'gender',
        'country_of_birth',
        'nationality',
        'primary_phone',
        'primary_postal',
        'primary_physical',
        'primary_email',
        'citizenship'
      ]
    })
    .then((res) => {
      console.log(res.data);
      if (onComplete) onComplete();
    })
    .catch((err) => {
      console.log(err);
    });
};
