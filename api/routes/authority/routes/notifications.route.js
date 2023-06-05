const express = require('express');
const { Instant } = require('../../../constants');
const rolesHelp = require('../../../factory/roles');
const NotificationsModel = require('../../../models/application/notifications.model');
const Service = require('../../../models/authority/service.model');
const cron = require('node-cron');
const { pushStatus, systemLogin } = require('../../../helpers/crm-status.helper');

let notificationsConfigs = []

const notificationsRouter = express.Router();

const initiateCRMUpdateTasks = () => {
  setCRMUpdateTasks((newConfigs)=>{
    notificationsConfigs = newConfigs
    
    scheduleTasks()
    startNotificationTasks()
  });
}

const scheduleTasks = () => {

  notificationsConfigs.filter(c=>c.notifyAt != Instant).forEach(config=>{
    console.log('Scheduled for -> ', config.notifyAt)
    //
    config.task = cron.schedule(config.tab, () =>  {

      NotificationsModel.find({serviceCode: {$in: config.serviceCodes}}, {
        status_code: 1,
        status_alias: 1,
        title: 1,
        attachments: 1,
        user_id: 1,
        message: 1,
        dismissed: 1,
        application_id: 1,
        response_type: 1,
        rich_text_message: 1,
        push_service: 1,
        push_payment: 1,
        form_payload: 1
      })
      .then(notifications=>{

        notifications.forEach(notification=>{
          systemLogin(token => {

            const payload = {
              status_code: notification.status_code,
              status_alias: notification.status_alias,
              title: notification.title,
              attachments: notification.attachments,
              user_id: notification.user_id,
              message: notification.message,
              dismissed: notification.dismissed,
              application_id: notification.application_id,
              response_type: notification.response_type,
              rich_text_message: notification.rich_text_message,
              push_service: notification.push_service,
              push_payment: notification.push_payment,
              form_payload: notification.form_payload
            }
              pushStatus({token, payload, onComplete: ()=>{
                notification.delete()
                console.log('Notification pushed and deleted')
              }, onError: ()=>{
                console.log('Error pushing notification')
              }})
          })
        })
      })
      .catch(err=>{
        console.log(`${config.notifyAt} notifs error => `, err)
      })
    }, {
      scheduled: false
    });
  })
}

const startNotificationTasks = () => {
  notificationsConfigs.forEach(config=>{
  // console.log('notificationsConfigs => ', config.task)

    if (config.task){
      config.task.start()
      // console.log('Task started => ', config.time)
    } else {
      // console.log('Task not started => ', config.time)
    }
  })
}

const stopNotificationTasks = () => {
  notificationsConfigs.forEach(config=>{
    if (config.task){
      config.task.stop()
      console.log('Task stopped => ', config.time)
    }
  })
}

const setCRMUpdateTasks = async (onComplete) => {

  Service.find({})
  .then(services=>{
    const newConfigs = []
    services.forEach(service=>{
      const notifyAt = service.notifyAt
      const time = notifyAt.split(':')

      const tab = notifyAt != Instant ? `${time[1]} ${time[0]} */1 */1 *` : undefined

      let task = newConfigs.find(t=>t.notifyAt == notifyAt) || {
        serviceCodes: [],
        time: service.notifyAt,
        notifyAt,
        tab
      }
    
      task.serviceCodes = [...task.serviceCodes, service.code]

      if (!newConfigs.find(t=>t.notifyAt == notifyAt)){
        newConfigs.push(task)
      }
    });

    stopNotificationTasks()
    onComplete(newConfigs)
  })
  .catch(err=>{
      console.log('Error tasks')
      console.log(err)
  })
}

notificationsRouter.route('/')
  .get((req, res, next) => {
    Service.find({}, { code: 1, notifyAt: 1, _id: 1, name: 1}).sort({name: 1}).exec((err, services) => {
      if (err) return next(err);
      const allServices = [];
      services.forEach(async service => {
        const notifications = await NotificationsModel.find({ serviceCode: service.code });
        allServices.push({
          _id: service._id,
          name: service.name,
          code: service.code,
          notifyAt: service.notifyAt,
          notifications
        })

        if (allServices.length === services.length) {
          res.json(allServices);
        }
      });
    });
  })
  .post((req, res, next) => {
    req.body.forEach(async (service, index) => {
      Service.findOneAndUpdate({ code: service.serviceCode }, { notifyAt: service.notifyAt })
      .exec((err, _) => {
        if (err && index === req.body.length - 1) return next(err);
        if (index === req.body.length - 1){
          res.status(200).send('Updated successfully');
          initiateCRMUpdateTasks()
        }
      });
    });
  });

notificationsRouter.route('/push-all-now')
  .get((req, res, next) => {
    NotificationsModel.find({}).exec((err, notifications) => {});
  });

module.exports = { notificationsRouter, initiateCRMUpdateTasks };