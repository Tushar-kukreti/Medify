import multer from 'multer';

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, './public/temp')
    },
    filename: function (req, file, cb) {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
      cb(null, file.fieldname + '-' + uniqueSuffix) // adds fieldname with some random data
        //example: avatar-128223, here avatar is the field name and 128223 is the random data
    }
})
  
export const upload = multer({ storage })