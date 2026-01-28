const multer = require('multer')
const multerS3 = require('multer-s3')
const AWS = require('aws-sdk')

const s3 = new AWS.S3({
  accessKeyId: process.env.IAM_ACCESS_ID,
  secretAccessKey: process.env.IAM_SECRET
})

module.exports = {
  postImages: 'postImages',
  postVideos: 'postVideos',
  avatars: 'avatars',
  cmsImages: 'cmsImages',
  bugFolder: 'BugFolder',
  userBackgrounds: 'userBackgrounds',
  sigStorage: 'sigStorage',
  scholarships: 'scholarships',
  sports: 'sports',
  quotes: 'quotes',
  uploadS3: (folder) => {
    return multer({
      storage: multerS3({
        s3,
        acl: 'public-read',
        bucket: process.env.BUCKET_NAME,
        contentType: multerS3.AUTO_CONTENT_TYPE,
        metadata: (req, file, cb) => {
          cb(null, { fieldName: file.fieldname })
        },
        key: (req, file, cb) => {
          cb(null, `${folder}/${`${Date.now().toString()}_${file.originalname}`}`)
        }
      })
    })
  },
  deleteS3: (folder, file) => {
    const fileFromURL = file.split('/').slice(-1)[0]
    return s3.deleteObject(
      {
        Bucket: process.env.BUCKET_NAME,
        Key: `${folder}/${fileFromURL}`
      },
      (err, data) => {
        if (err) console.log(err, err.stack)
        // an error occurred
        else console.log(data) // successful response
      }
    )
  }
}
