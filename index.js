const vision = require('@google-cloud/vision')
const path = require('path');


const keyFilename = path.join(__dirname, 'uniperruno.json');

quickStart()
async function quickStart(){
    const client = new vision.ImageAnnotatorClient({keyFilename})
    // Para detectar texto de las imagenes.
    const [result] = await client.labelDetection('./resources/gato.jpg');

    // const [result] = await client.textDetection('./resources/gato.jpg');
    // Para 
    const labels = result.labelAnnotations
    labels.forEach(label => console.log(label.description))
}


