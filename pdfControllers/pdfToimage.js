

const admzip = require('adm-zip');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const { exec } = require('child_process');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadsDir = path.join(__dirname, '../uploads');
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir);
    }
    cb(null, 'uploads');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage: storage }).single('pdfFile');

exports.pdfToImage =  (req, res) => {
  upload(req, res, (err) => {
    if (err) {
      console.log(err);
      res.status(500).json({ error: 'File upload failed' });
    } else {
      console.log(req.file.path);
      const outputfile = path.join(__dirname, 'output.zip');
      const outputzip = new admzip();

      exec(`magick convert ${req.file.path} -quality 100 output-%3d.jpg`, (err, stdout, stderr) => {
        if (err) {
          console.log(err);

          res.status(500).json({ error: 'PDF to image conversion failed' });

        } else {

          const filesDir = path.join(__dirname, '../');

          const jpgFiles = fs.readdirSync(filesDir).filter((el) => el.startsWith('output-') && path.extname(el) === '.jpg');

          jpgFiles.forEach((file) => {
            outputzip.addLocalFile(path.join(filesDir, file));
          });

          outputzip.writeZip(outputfile);

          // Send the zip file as a response for download

          res.download(outputfile, outputfile, (err) => {
            if (err) {
              console.log(err);
              res.status(500).json({ error: 'Download failed' });
            }

            fs.unlinkSync(outputfile);
            // fs.unlinkSync.("../uploads"); 
          });

          console.log('Conversion completed');
        }
      });
    }
  });
};
 
