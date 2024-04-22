const vision = require('@google-cloud/vision')
const {Translate} = require('@google-cloud/translate').v2;

// Crear un cliente de Translate
const path = require('path');
const express = require('express');
const cors = require('cors');
const multer = require('multer');

const app = express()
app.use(cors()); 
const port = 3001

//Dependencia que sirve para subir archivos en express, guarda todo en /uploads.
const upload = multer({
    dest: 'uploads/'  // This is the folder where files will be saved temporarily
});


app.set('views', './views'); // Define la carpeta donde se guardarán tus archivos Pug
app.set('view engine', 'pug'); // Establece Pug como el motor de plantillas

app.listen(port, ()=>
{
    console.log("Server is running  on port ", port)
})

// Importando el archivo de configuracion de google API Vision.
const keyFilename = path.join(__dirname, 'uniperruno.json');

app.get("/", (req, res)=>{
    res.render("upload")
})

app.post("/upload", upload.single('image'), async(req, res) =>{
    if (!req.file) {
        return res.status(400).send('No file uploaded.');
    }
    const filePath = path.join(__dirname, req.file.path);

    const text = await opticalRecognition(filePath)
    const translation = await translateText(text, 'es')
    console.log(translation)
    res.json({text, translation})
})

const client = new vision.ImageAnnotatorClient({ keyFilename });
const translate = new Translate({keyFilename})

async function opticalRecognition(imagePath){
    const [result] = await client.textDetection(imagePath);
    const detections = result.textAnnotations;
    return detections.at(0).description
}

async function translateText(text, targetLanguage) {
    const [translation] = await translate.translate(text, targetLanguage);
    return translation;
}


