const vision = require('@google-cloud/vision')
const {Translate} = require('@google-cloud/translate').v2;

require('dotenv').config();

// Crear un cliente de Translate
const path = require('path');
const express = require('express');
const cors = require('cors');
const multer = require('multer');

const app = express()
app.use(cors()); 
app.use(express.json());
const port = process.env.PORT || 3001;

//Guarda todo en /uploads.
const upload = multer({
    dest: 'uploads/' 
});


app.listen(port, ()=>
{
    console.log("Server is running  on port ", port)
})

// Importando el archivo de configuracion de google API Vision.
const credentials = JSON.parse(process.env.GOOGLE_APPLICATION_CREDENTIALS_JSON) || path.join(__dirname, 'uniperruno.json');

app.get("/", (req, res)=>{
    res.render("upload")
})

app.post("/upload", upload.single('image'), async(req, res) =>{
    if (!req.file) {
        return res.status(400).send('No file uploaded.');
    }
    const filePath = path.join(__dirname, req.file.path);

    const text = await opticalRecognition(filePath)
    const translation = await translateText(text, 'en')
    console.log(translation)
    res.json({text, translation})
})

app.post("/translate", async(req, res) => {
    const { text } = req.body;

    if (!text) {
        return res.status(400).send('No text provided.');
    }

    try {
        const translation = await translateText(text, 'en');
        res.json({ translation });
    } catch (error) {
        console.error('Error translating text:', error);
        res.status(500).send('Error translating text.');
    }
});



const client = new vision.ImageAnnotatorClient({credentials});
const translate = new Translate({credentials})

async function opticalRecognition(imagePath){
    const [result] = await client.textDetection(imagePath);
    const detections = result.textAnnotations;
    return detections.at(0).description
}

async function translateText(text, targetLanguage) {
    const [translation] = await translate.translate(text, targetLanguage);
    return translation;
}


