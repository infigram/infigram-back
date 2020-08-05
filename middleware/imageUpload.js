const multer = require('multer')
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const validator = require('validator')

cloudinary.config({ 
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
  api_key: process.env.CLOUDINARY_API_KEY, 
  api_secret: process.env.CLOUDINARY_API_SECRET 
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'posts',
    format: async (req, file) => 'png', // supports promises as well
    public_id: (req, file) => req.fileAddress,
  },
});

const fileFilter = (req, file, cb)=>{

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

module.exports = multer({storage: storage, fileFilter: fileFilter})