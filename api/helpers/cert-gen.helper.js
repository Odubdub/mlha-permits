const puppeteer = require('puppeteer');
const CertificateCounter = require('../models/certificate/certificate-counter.model');
const PDFDocument = require('pdf-lib').PDFDocument
const generateCertificate = async (certData, callback) => {
  const { id, type, suffix, uid, service, conditions, department } = certData;

  const queryfilter = { suffix };
  const queryOptions = { upsert: true, new: true, setDefaultsOnInsert: true };
  const databaseOperation = { suffix, $inc: { count: 1 } };

  let certificateCounterResult = {}

  try {

    let certID = uid
    if (!certID){
      certificateCounterResult = await CertificateCounter.findOneAndUpdate(queryfilter, databaseOperation, queryOptions)
      const newCount = String(certificateCounterResult.count);
      certID = `BW${newCount.padStart(6, '0')}${suffix||'PM'}`;
    }
  
    //Main page
    const browser = await puppeteer.launch({ headless: true });

    //Page 1
    const page1 = await browser.newPage();
    // const page1URL = `http://${process.env.BASE_APP_SERVER_HOST}:${process.env.BASE_APP_SERVER_PORT}/certificate?id=${id}&type=${type}&certID=${certID}&page=1`
    const page1URL = `http://localhost:${process.env.BASE_APP_SERVER_PORT}/certificate?id=${id}&type=${type}&certID=${certID}&page=1&department=${department}`
    console.log('Certificate URL is: ', page1URL)

    await page1.goto(page1URL, { waitUntil: ['load', 'domcontentloaded', 'networkidle0'] });
    await page1.waitForSelector('.qrcode', { timeout: 3000, visible: true });
   
    const page1Buffer = await page1.pdf({
      format: 'A4',
      printBackground: true
    });

    var pdfsToMerge = [page1Buffer];

    if (conditions){

      //Page 2
      const page2 = await browser.newPage();
      // const page2URL = `http://${process.env.BASE_APP_SERVER_HOST}:${process.env.BASE_APP_SERVER_PORT}/certificate?id=${service}&page=2`
      const page2URL = `http://localhost:${process.env.BASE_APP_SERVER_PORT}/certificate?id=${service}&page=2&department=${department}`
    
      console.log('Conditions URL is: ', page2URL)
      await page2.goto(page2URL, { waitUntil: ['load', 'domcontentloaded', 'networkidle0'] });

      const page2Buffer = await page2.pdf({
        format: 'A4',
        printBackground: true
      });

      pdfsToMerge.push(page2Buffer);
    }

    //Merge the pages
    const mergedPdf = await PDFDocument.create(); 
    for (const pdfBytes of pdfsToMerge) { 
      const pdf = await PDFDocument.load(pdfBytes); 
      const copiedPages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
      copiedPages.forEach((page) => {
          mergedPdf.addPage(page); 
      }); 
    }

    const file = await mergedPdf.saveAsBase64();
    const buff = Buffer.from(file, 'base64')
    const fileName = `${certID}.pdf`;

    // callback({message:"error"}, null);
    // return;
    callback(null, {fileBuffer: buff, fileName, certID});
    await browser.close();
  } catch (error) {
    callback(error, null);
  }
}

module.exports = { generateCertificate };