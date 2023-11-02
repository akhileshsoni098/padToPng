
/* 
const express = require('express');

const admzip = require("adm-zip")
const multer = require("multer")

const path = require("path")
const fs = require('fs');
const app = express();
const port = 3000;

app.use(express.json());

// upload directory as static 
app.use(express.static(path.join(__dirname + "uploads")))


const bodyParser = require("body-parser")

app.use(bodyParser.urlencoded({ extended: false }))

const { exec } = require("child_process");
const { stdout, stderr } = require('process');


app.use(bodyParser.json())


// multer config

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "uploads");
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname));
    },
});

const upload = multer({ storage: storage }).single('pdfFile')


app.get("/", async (req, res) => {
    const indexPath = path.join(__dirname, 'index.html');
    res.sendFile(indexPath);
});


app.post('/convert', (req, res) => {

    upload(req, res, (err) => {
        if (err) {
            console.log(err)
        } else {
            console.log(req.file.path)

            outputfile = Date.now() + "output.zip"

            var outputzip = new admzip()

            exec(`magick convert ${req.file.path} -quality 100 output-%3d.jpg`, (err, stdout, stderr) => {
                if (err) {
                    console.log(err);
                } else {

                    // add the files to the zip file
                    fs.readdir(__dirname, function (err, files) {
                        const jpgFiles = files.filter(
                            (el) => path.extname(el) === ".jpg"
                        )

                        console.log(jpgFiles)

                        jpgFiles.forEach(file => {
                            outputzip.addLocalFile(path.join(__dirname + "/" + file))
                        })
 
                    })
                    outputzip.writeZip(outputfile)

                    console.log("Conversion completed");
                }
            });


        }
    })


});


app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
 */


/* 
const express = require('express');
const admzip = require("adm-zip");
const multer = require("multer");
const path = require("path");
const fs = require('fs');
const app = express();
const port = 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, "uploads")));

const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const { exec } = require("child_process");

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "uploads");
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname));
    },
});

const upload = multer({ storage: storage }).single('pdfFile');

app.get("/", async (req, res) => {
    const indexPath = path.join(__dirname, 'index.html');
    res.sendFile(indexPath);
});

app.post('/convert', (req, res) => {
    upload(req, res, (err) => {
        if (err) {
            console.log(err);
            res.status(500).json({ error: "File upload failed" });
        } else {
            console.log(req.file.path);
            const outputfile = Date.now() + "output.zip";
            const outputzip = new admzip();

            exec(`magick convert ${req.file.path} -quality 100 output-%3d.jpg`, (err, stdout, stderr) => {
                if (err) {
                    console.log(err);
                    res.status(500).json({ error: "PDF to image conversion failed" });
                } else {
                    fs.readdir(__dirname, function (err, files) {
                        const jpgFiles = files.filter(
                            (el) => path.extname(el) === ".jpg"
                        );
                        jpgFiles.forEach(file => {
                            outputzip.addLocalFile(path.join(__dirname, file));
                        });
                        outputzip.writeZip(outputfile);

                        // Send the zip file as a response for download
                        res.download(outputfile, (err) => {
                            if (err) {
                                console.log(err);
                                res.status(500).json({ error: "Download failed" });
                            }
                        });

                        console.log("Conversion completed");
                    });
                }
            });
        }
    });
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});

 */


/// auto create upload file issue resolve in the 3rd step
const express = require('express');
const admzip = require("adm-zip");
const multer = require("multer");
const path = require("path");
const fs = require('fs');
const app = express();
const port = 3000;

app.use(express.json());

const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const { exec } = require("child_process");

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const uploadsDir = path.join(__dirname, "uploads");
        if (!fs.existsSync(uploadsDir)) {
            fs.mkdirSync(uploadsDir);
        }
        cb(null, "uploads");
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname));
    },
});

const upload = multer({ storage: storage }).single('pdfFile');

app.get("/", async (req, res) => {
    const indexPath = path.join(__dirname, 'index.html');
    res.sendFile(indexPath);
});

app.post('/convert', (req, res) => {
    upload(req, res, (err) => {
        if (err) {
            console.log(err);
            res.status(500).json({ error: "File upload failed" });
        } else {
            console.log(req.file.path);
            const outputfile = Date.now() + "output.zip";
            const outputzip = new admzip();

            exec(`magick convert ${req.file.path} -quality 100 output-%3d.jpg`, (err, stdout, stderr) => {
                if (err) {
                    console.log(err);
                    res.status(500).json({ error: "PDF to image conversion failed" });
                } else {
                    fs.readdir(__dirname, function (err, files) {
                        const jpgFiles = files.filter(
                            (el) => path.extname(el) === ".jpg"
                        );
                        jpgFiles.forEach(file => {
                            outputzip.addLocalFile(path.join(__dirname, file));
                        });
                        outputzip.writeZip(outputfile);

                        // Send the zip file as a response for download
                        res.download(outputfile, (err) => {
                            if (err) {
                                console.log(err);
                                res.status(500).json({ error: "Download failed" });
                            }
                        });

                        console.log("Conversion completed");
                    });
                }
            });
        }
    });
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
