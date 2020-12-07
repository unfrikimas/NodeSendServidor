const multer = require('multer');
const shortid = require('shortid');
const fs = require('fs');
const Enlaces = require('../models/Enlace');

exports.subirArchivo = async (req, res, next) => {

    const configuracionMulter = {
        limits: { fileSize: req.usuario ? 1024 * 1024 * 10 : 1024 * 1024 },
        storage: fileStorage = multer.diskStorage({
            destination: (req, file, cb) => {
                cb(null, __dirname+'/../uploads')
            },
            filename: (req, file, cb) => {
                // const extension = file.mimetype.split('/')[1];
                const extension = file.originalname.substring(file.originalname.lastIndexOf('.'), file.originalname.length);
                cb(null, `${shortid.generate()}${extension}`);
            },
            //filtrar por formato de archivos
            // fileFilter: (req, file, cb) => {
            //     if(file.mimetype === 'application/pdf') {
            //         return cb(null, true);
            //     }
            // }
        })
    }    

    const upload = multer(configuracionMulter).single('archivo');

    upload(req, res, async(error) => {
        // console.log(req.file)
        if(!error) {
            res.json({ archivo: req.file.filename });
        } else {
            console.log(error);
            return next();
        }
    })

}

// Descarga un archivo
exports.descargar = async (req, res, next) => {

    // Obtiene el enlace
    const { archivo } = req.params;
    const enlace = await Enlaces.findOne({ nombre: archivo });

    const archivoDescarga = __dirname + '/../uploads/' + archivo;
    res.download(archivoDescarga);

    // Eliminar el archivo y la entrada de la BD
    // Si las descargas son iguales a 1 - Borrar la entrada y borrar el archivo
    const { descargas, nombre } = enlace;

    if(descargas === 1) {

        // Eliminar el archivo 
        req.archivo = nombre;

        try {
            // eliminar la entrada de la bd
            await Enlaces.findOneAndDelete({ _id: enlace._id });
            next()
        } catch (error) {
            console.log(error)   
        }

    } else {
         // si las descargas son > a 1 - Restar 1
         enlace.descargas--;
         await enlace.save();
    }

}

exports.eliminarArchivo = async (req, res) => {
    // console.log(req.archivo)
    try {
        fs.unlinkSync(__dirname + `/../uploads/${req.archivo}`);
        
    } catch (error) {
        console.log(error);
    }
}