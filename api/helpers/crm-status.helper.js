const axios = require('axios');
const { default: mongoose } = require('mongoose');
const { Instant } = require('../constants');
const notificationsModel = require('../models/application/notifications.model');
const Service = require('../models/authority/service.model');
  
const updateApplicationStatus = async ({
    applicationId,
    responseType='Notification',
    pushService=null,
    correctionFields=[],
    serviceCode,
    userId,
    statusCode,
    attachments=[],
    title,
    message,
    richMessage=null,
    pushPayment={},
    alias,
    onComplete,
    onError}) => {

    const notificationPayload = {
        status_code: statusCode,
        status_alias: alias,
        title: title,
        attachments: attachments,
        user_id: userId,
        message: message,
        dismissed: false,
        application_id: applicationId,
        response_type: responseType,
        rich_text_message: richMessage,
        push_service: pushService,
        push_payment: pushPayment,
        form_payload: correctionFields,
    }

    const service = await Service.findOne({ code: serviceCode });

    if (service.notifyAt == Instant){
        console.log('Pushing Notification: ', notificationPayload)
        systemLogin(token => {
            pushStatus({token, payload: notificationPayload, onComplete, onError})
        })
    } else {
        const notification = notificationsModel({
            _id: new mongoose.Types.ObjectId(),
            ...notificationPayload, 
            serviceCode
        })
        notification.save()
        .then(()=>{
            onComplete()
            console.log('done')
        })
        .catch(err=>{
            console.log(err.message)
            onError(err)
        })

        //create new notification obj
    }
}

const pushStatus = ({token, payload, onComplete, onError}) => {

        const responsePayload = {
          reference: {
            status: payload.status_code,
            user_id: payload.user_id,
            application_id: payload.application_id,
            type: payload.response_type,
            service_code: payload.push_service || payload.service_code || null
          },
          payload: {
            title: payload.title,
            attachments: payload.attachments || [],
            message: payload.message,
            fields: payload.form_payload,
            description: payload.rich_text_message
          }
        }

        console.log(JSON.stringify(responsePayload, null, 2))

        const config = {
            method: 'post',
            url: process.env.CRM_STATUS_UPDATE_URL,
            headers: { 
              'application-id': payload.application_id,
              'Authorization': `Bearer ${token}`, 
              'Content-Type': 'application/json'
            },
            data: JSON.stringify(responsePayload)
          };
          
          axios(config)
          .then((response) => {
            console.log(JSON.stringify(response.data));
            if (onComplete) onComplete()
          })
          .catch(function (error) {
            console.log(error);
            if (onError) onError()
          });
}

const systemLogin = (onLoggedIn) => {

    const data = JSON.stringify({
        "username": "permits-admin",
        "password": "W3g0!ng2D!3"
      });
      
      const config = {
        method: 'post',
        url: 'https://gateway-cus-acc.gov.bw/auth/login',
        headers: { 
          'Content-Type': 'application/json',
        },
        data : data
      };
      
      axios(config)
      .then(response => {
        onLoggedIn(response.data.access_token)
      })
      .catch(function (error) {
        console.log('error getting token');
        console.log(error);
      });
  }

const newSystemLogin = async () => {
  const systemAuthLoginData = {
    "username": "permits-admin",
    "password": "W3g0!ng2D!3"
  };

  const systemAuthLoginConfig = {
    method: 'post',
    data: systemAuthLoginData,
    headers: { 'Content-Type': 'application/json' },
    url: 'https://gateway-cus-acc.gov.bw/auth/login'
  };

  const systemAuthLoginResponse = await axios(systemAuthLoginConfig);
  return await systemAuthLoginResponse.data;
}

const fetchUserFromIAM = async (idNumber, iamToken) => {
  // const systemAuthLoginResponse = await newSystemLogin();

  const userExistsInCRMConfig = {
    method: 'get',
    url: `https://gateway-cus-acc.gov.bw/users/?username=${idNumber}`,
    headers: { 'Authorization': `Bearer ${iamToken}` }
  };

  try {
    const userExistsInCRMResponse = await axios(userExistsInCRMConfig);

    return await userExistsInCRMResponse.data;
  } catch (error) {
    return null;
  }
}

module.exports = { updateApplicationStatus, systemLogin, pushStatus, newSystemLogin, fetchUserFromIAM };


// systemLogin(token=>{

//   var axios = require('axios');

//   var config = {
//     method: 'get',
//     url: `https://uat-gateway.onegov-bw.online/users/?username=${omangNumber}`,
//     headers: { 
//       'Authorization': `Bearer ${token}`
//     }
//   };

//   axios(config)
//   .then((response) => {
//     const user = response.data
//     const adminUser = AdminUser({
//       _id: new mongoose.Types.ObjectId(),
//       name: `${user.firstname || 'Unknown'} ${user.lastname || 'Unknown'}`,
//       idNo: req.query.idNo,
//       userID,
//       phone: user.phone_number,
//       isActive: req.query.isActive,
//       aptDate,
//       aptBy: req.query.aptBy,
//       position: req.query.position,
//       roles,
//       office: req.query.office,
//       active: {
//         token: uuidv4()
//       }
//     })

//     adminUser
//     .save()
//     .then((_) => {
//       res.status(200).json(user)
//     })
//     .catch((err) => {
//       console.log(err)
//       res.status(500).send({message: 'Failed to save user'})
//     })
//   })
//   .catch((error) => {
//     console.log(error);
//     res.status(500).send({
//       message: error.response.data.message == 'User not found' ? `User with this 1Gov ID was not found. A 1Gov account is required.` : error.response.data.message
//     })
//   });
// })


// } else {
// res.status(404).send({
//   message: 'A user with this 1Gov ID Exists. Update their details instead.'
// })
// }
// })