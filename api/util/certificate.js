const pupperteer = require('puppeteer')
const counter = require('../models/certificate/counter')
const createPdf = async ({id, suffix, type, onComplete, onError}) => {

//Get the permit id from the counter
  var options = { upsert: true, new: true, setDefaultsOnInsert: true }
  counter.findOneAndUpdate(
      { suffix: suffix },
      { $inc: { count: 1 } },
      options,
      async ( error, result)=>{
     
        if (result){

          const newCount = String(result.count)
          const certID = `BW${newCount.padStart(6, '0')}${suffix||'PM'}`
          const browser = await pupperteer.launch()
          const page = await browser.newPage()

          const name = `${certID}.pdf`
          const path = `pdfs/${name}`

          const options = {
            path: path,
            format: 'A4',
            printBackground: true
          }

        console.log(id);
        console.log(type);
        console.log(certID);

        await page.goto(`http://localhost:3000/certificate?id=${id}&type=${type}&certID=${certID}`, {waitUntil: 'networkidle2'})
        const fileBuffer = await page.pdf(options)
        await browser.close()
    
        onComplete({id: certID, path: path})

        // return {identifier: id, path: path, fileBuffer: fileBuffer, fileName: name}
        

      } else {
        onError(error)
      }
  })
}

module.exports = { createPdf };