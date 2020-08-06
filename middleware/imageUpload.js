const multer = require('multer')
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const validator = require('validator')
const uuid = require('uuid')

//Cloudinary api key
cloudinary.config({ 
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
  api_key: process.env.CLOUDINARY_API_KEY, 
  api_secret: process.env.CLOUDINARY_API_SECRET 
});

//Set up storage
const storage = new CloudinaryStorage({
  //Cloudinary
  cloudinary: cloudinary,
  params: {
    //Cloudinary's folder
    folder: 'posts',
    //PNG
    format: async (req, file) => 'png', // supports promises as well
    public_id: (req, file) => req.fileAddress,
    //Support secure transport
    secure: true,
    //Transformation
    transformation: [
      {width: 400, gravity: "face", crop: "fill"},
      //Quality auto
      {quality: "auto", fetch_format: "auto"},
      //Width 400
      {width: 400, crop: "scale"}
    ]
  },

});

/**
 * Validation of title and content length with file extensions
 * @param {*} req 
 * @param {*} file 
 * @param {*} cb 
 */
const fileFilter = (req, file, cb)=>{
  req.fileAddress= `${req.userId}/${uuid.v1()}`
  req.body.title = req.body.title.trim()
  req.body.content = req.body.content.trim()

  const validationErrors = []
  if(!validator.isLength((req.body.title),{min:5})){
    validationErrors.push('invalid title body')
  }
  if(!validator.isLength((req.body.content),{min:5})){
    validationErrors.push('invalid content body')
  }
  req.validationErrors = validationErrors

  if ((file.mimetype === 'image/png' ||
      file.mimetype === 'image/jpg' ||
      file.mimetype === 'image/jpeg') && 
      validationErrors.length === 0) {
        cb(null, true)
  } else {

      cb(null, false)
  }
}

module.exports = multer({storage: storage, fileFilter: fileFilter,limits: {fileSize: 1024 * 1024 * 10}})