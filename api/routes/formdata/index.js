const bodyParser = require('body-parser');
const express = require('express');
const { default: mongoose } = require('mongoose');
const Service = require('../../models/authority/service.model');
const hscodeModel = require('../../models/forms/hscode.model');
const hscode = require('../../models/forms/hscode.model');
const TariffItem = require('../../models/tariff_items/tariff_item.model')

const formdataRouter = express.Router();
formdataRouter.use(bodyParser.json());


formdataRouter.route('/hscodes/edit/:serviceCode')
  .post(async (req, res, next) => {
    
    const codes = req.body
    //check if req.body id array
    if (Array.isArray(codes)){
        for (let i = 0; i < codes.length; i++) {
            const newCode = codes[i];
            
            const existingCode =  await hscode.findOne({code: newCode.code, serviceCode: req.params.serviceCode});
            
            //if code exists, update it
            if (existingCode){
                await hscode.findOneAndUpdate({
                    code: newCode.code,
                    serviceCode: req.params.serviceCode
                }, { description: newCode.description, category: newCode.category });
            } else {
                //if code doesn't exist, create it
                await hscode.create({
                    _id: new mongoose.Types.ObjectId(),
                    serviceCode: req.params.serviceCode,
                    code: newCode.code,
                    description: newCode.description,
                    category: newCode.category
                });
            }
        }

        res.status(200).json({message: 'Success'})
    } else {
        res.status(403).json({message: 'Invalid request body'})
    }
    }
    )
  .delete(async (req, res) => {
    const codes = req.body
    //check if req.body id array
    if (Array.isArray(codes)){
        for (let i = 0; i < codes.length; i++) {
            const codeToDelete = codes[i];
            await hscode.findOneAndDelete({code: codeToDelete.code, serviceCode: req.params.serviceCode});
        }
        res.status(200).json({message: 'Success'})
    } else {
        res.status(403).json({message: 'Invalid request body'})
    }
   })

   formdataRouter.route('/hscodes/:serviceCode')
  .all((req, res, next) => {
//     if (req.params.serviceCode == 'MTI_007_12_012'){
//         return res.status(200).json(randomProducts(50, req.params.serviceCode))

//     } else {

//     return res.status(200).json(randomProducts(50, req.params.serviceCode))
// }
    TariffItem.find({})
        .then(codes=>{
            if (codes.length){
                res.status(200).json(codes.map(e=>({
                    "key": e.hscode,
                    "value": e.description
                })))
            } else {
                res.status(200).json([
                    {
                        "key": '0',
                        "value": 'Other'
                    } 
                ])
            }
        })
  });

  formdataRouter.route('/hscodes/:serviceCode/search')
  .all((req, res, next) => {

    const query = req.query.q || 'no query - '

    if (req.params.serviceCode == 'MTI_007_12_012'){
        return res.status(200).json(randomProducts(50, req.params.serviceCode, query))

    } else {

    return res.status(200).json(randomProducts(50, req.params.serviceCode, query))
}
  });
        
  // function that returns a list of 500 random products
    function randomProducts(count=100, serviceCode, query) {
        const products = [];
        for (let i = 0; i < getCount(serviceCode); i++) {
            products.push({
                "key":`${i}.${ Math.floor(Math.random() * 1000000)}.${ Math.floor(Math.random() * 1000000)}`,
                "value": randomSentence(serviceCode, query)
            });
        }
        return products;
    }

    // Create a function that casts last section of serviceCode = 'MTI_007_12_012' into a number
    const getCount = (serviceCode) => {

        const arr = serviceCode.split('_')

        //Check if last element can be casted into a number


        //cast last element of arr to number
        if (isNaN(arr[arr.length-1])){
            return 50
        }
        return Number(arr[arr.length-1]) * 10
    }

    //Generate random sentence
    function randomSentence(serviceCode, query) {
        const words = ['Lorem', 'ipsum', 'dolor', 'sit', 'amet', 'consectetur', 'adipiscing', 'elit', 'sed', 'do', 'eiusmod', 'tempor', 'incididunt', 'ut', 'labore', 'et', 'dolore', 'magna', 'aliqua', 'Ut', 'enim', 'ad', 'minim', 'veniam', 'quis', 'nostrud', 'exercitation', 'ullamco', 'laboris', 'nisi', 'ut', 'aliquip', 'ex', 'ea', 'commodo', 'consequat', 'Duis', 'aute', 'irure', 'dolor', 'in', 'reprehenderit', 'in', 'voluptate', 'velit', 'esse', 'cillum', 'dolore', 'eu', 'fugiat', 'nulla', 'pariatur', 'Excepteur', 'sint', 'occaecat', 'cupidatat', 'non', 'proident', 'sunt', 'in', 'culpa', 'qui', 'officia', 'deserunt', 'mollit', 'anim', 'id', 'est', 'laborum'];
        const sentence = [];
        for (let i = 0; i < 3; i++) {
            sentence.push(words[Math.floor(Math.random() * words.length)]);
        }


        return `${query} ${sentence.join(' ')} ${serviceCode.replace(/_/g, '').toLowerCase()}`;
    }

module.exports = formdataRouter;