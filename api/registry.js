require('dotenv').config();
const Eureka = require('eureka-js-client').Eureka

const registerService = () => {
  // const client =  new Eureka({
  //   instance: {
  //     app: 'applications',
  //     ipAddr: '10.0.25.19',
  //     hostName: process.env.APP_HOST,
  //     statusPageUrl:`${process.env.APP_SERVER_PROTOCOL}${process.env.APP_HOST}/applications/alive`,
  //     port: {
  //       '$': process.env.BASE_APP_SERVER_PORT,
  //       '@enabled': false,
  //     },
  //     vipAddress: process.env.APP_HOST,
  //     dataCenterInfo: {
  //       '@class': 'com.netflix.appinfo.InstanceInfo$DefaultDataCenterInfo',
  //       name: 'MyOwn',
  //     }
  //   },
  //   eureka: {
  //     serviceUrls: {
  //       default: [
  //         'https://reg-eur-acc.gov.bw/eureka/apps/'
  //       ]
  //     }
  //   },
  //   // eureka: {
  //   //   host: 'reg-eur-acc.gov.bw',
  //   //   servicePath: '/eureka/apps/',
  //   //   port: 8761
  //   // }
  // })

  // client.logger.level('debug');

  // client.start((err) => {
  //   if (err) console.log('Registration passed!');;
  // });
}

registerService();

module.exports = registerService;