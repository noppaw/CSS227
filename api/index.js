/*
const express = require("express");
const cors = require('cors');
const { default: mongoose } = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('./models/User.js');
const Item = require('./models/Item.js');
const cookieParser = require('cookie-parser');
const imageDownloader = require('image-downloader');
const multer = require('multer');
const fs = require('fs');

require('dotenv').config();
const app = express();

const bcryptSalt = bcrypt.genSaltSync(10);
const jwtSecret = 'fasefraw4r5r3wq45wdfgw34twdfg';

app.use(express.json());
app.use(cookieParser());
app.use('/uploads', express.static(__dirname+'/uploads'))
app.use(cors({
    credentials: true,
    origin: 'http://localhost:5173',
}));

//pass AkEgvSXFSfUOCnlz
mongoose.connect(process.env.MONGO_URL);

app.get('/test', (req, res) => {
    res.json('test ok');
});

app.post('/register', async (req, res) => {
    const { name, email, password } = req.body;
    try {
        const userDoc = await User.create({
            name,
            email,
            password: bcrypt.hashSync(password, bcryptSalt),
        });
        res.json(userDoc);
    } catch (e) {
        res.status(422).json(e);
    }
});

app.post('/login', async (req, res) => {
    const { email, password } = req.body;
    const userDoc = await User.findOne({ email });
    if (userDoc) {
        const passOk = bcrypt.compareSync(password, userDoc.password);
        if (passOk) {
            jwt.sign({
                email: userDoc.email,
                id: userDoc._id,
            }, jwtSecret, {}, (err, token) => {
                if (err) throw err;
                res.cookie('token', token).json(userDoc);
            });
        } else {
            res.status(422).json('Invalid password');
        }
    } else {
        res.status(404).json('User not found');
    }
});


function authenticateToken(req, res, next) {
    const token = req.cookies.token;
    if (token) {
        jwt.verify(token, jwtSecret, (err, userData) => {
            if (err) {
                res.status(403).json('Invalid token');
            } else {
                req.userData = userData;
                next();
            }
        });
    } else {
        res.status(401).json('Unauthorized');
        return;
    }
}

app.get('/profile', authenticateToken, async (req, res) => {
    const { id } = req.userData;
    try {
        const { name, email, _id } = await User.findById(id);
        res.json({ name, email, _id });
    } catch (err) {
        res.status(500).json('Internal server error');
    }
});

app.post('/logout', (req, res) => {
    res.clearCookie('token').json(true);
});


app.post('/upload-by-link', async (req,res) => {
    const {link} = req.body;
    const newName = 'photo' + Date.now() + '.jpg';
    await imageDownloader.image({
        url: link,
        dest: __dirname + '/uploads/' + newName,
    });
    res.json(newName);
})

const photosMiddleware = multer({dest:'uploads/'});
app.post('/upload', photosMiddleware.array('photos', 100),(req,res) => {
    const uploadedFiles = [];
    for (let i = 0; i < req.files.length; i++){
        const {path,originalname} = req.files[i];
        const parts = originalname.split('.');
        const ext = parts[parts.length - 1];
        const newPath = path + '.' + ext;
        fs.renameSync(path, newPath);
        uploadedFiles.push(newPath.replace("uploads\\",''));
    }
    res.json(uploadedFiles);
});

app.post('/gallery', (req,res) => {
    const {token} = req.cookies;
    const {title,addedPhotos,description} = req.body;
    jwt.verify(token, jwtSecret, {}, async (err, userData) => {
        if (err) throw err;
        const itemsDoc = await Item.create({
            owner:userData.id,
            title,photos:addedPhotos,description,
        });
        res.json(itemsDoc);
    });
});

app.get('/gallery', (req,res) => {
    const {token} = req.cookies;
    jwt.verify(token, jwtSecret, {}, async (err, userData) => {
        const {id} = userData;
        res.json ( await Item.find({owner:id}) );

    });
});

app.get('/gallery/:id', async (req,res) => {
   const {id} = req.params;
   res.json(await Item.findById(id)); 
   console.log();
});

app.put('/gallery', async (req,res) => {
    const {token} = req.cookies;
    const {id, title,addedPhotos,description} = req.body;
    jwt.verify(token, jwtSecret, {}, async (err, userData) => {
        if (err) throw err;
        const itemsDoc = await Item.findById(id);
        if (userData.id === itemsDoc.owner.toString()) {
            itemsDoc.set({
                title,photos:addedPhotos,description,
            });
            await itemsDoc.save();
            res.json('ok');
        }
    });
});

/*
app.get('/gallery', async (req,res) => {
    res.json (await Item.find() );
})
===

app.get('/gallery', async (req, res) => {
    try {
      const item = await Item.find();
      res.json(item);
    } catch (err) {
      res.status(500).json('Internal server error');
    }
});

  
app.listen(4000, () => {

});

*/

const express = require("express");
const cors = require('cors');
const { default: mongoose } = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('./models/User.js');
const Item = require('./models/Item.js');
const cookieParser = require('cookie-parser');
const imageDownloader = require('image-downloader');
const multer = require('multer');
const fs = require('fs');

require('dotenv').config();
const app = express();

const bcryptSalt = bcrypt.genSaltSync(10);
const jwtSecret = 'fasefraw4r5r3wq45wdfgw34twdfg';

app.use(express.json());
app.use(cookieParser());
app.use('/uploads', express.static(__dirname+'/uploads'))
app.use(cors({
    credentials: true,
    origin: 'http://localhost:5173',
}));

mongoose.connect(process.env.MONGO_URL);

app.get('/test', (req, res) => {
    res.json('test ok');
});

app.post('/register', async (req, res) => {
    const { name, email, password } = req.body;
    try {
        const userDoc = await User.create({
            name,
            email,
            password: bcrypt.hashSync(password, bcryptSalt),
        });
        res.json(userDoc);
    } catch (e) {
        res.status(422).json(e);
    }
});

app.post('/login', async (req, res) => {
    const { email, password } = req.body;
    const userDoc = await User.findOne({ email });
    if (userDoc) {
        const passOk = bcrypt.compareSync(password, userDoc.password);
        if (passOk) {
            jwt.sign({
                email: userDoc.email,
                id: userDoc._id,
            }, jwtSecret, {}, (err, token) => {
                if (err) throw err;
                res.cookie('token', token).json(userDoc);
            });
        } else {
            res.status(422).json('Invalid password');
        }
    } else {
        res.status(404).json('User not found');
    }
});

function authenticateToken(req, res, next) {
    const token = req.cookies.token;
    if (token) {
        jwt.verify(token, jwtSecret, (err, userData) => {
            if (err) {
                res.status(403).json('Invalid token');
            } else {
                req.userData = userData;
                next();
            }
        });
    } else {
        res.status(401).json('Unauthorized');
        return;
    }
}

app.get('/profile', authenticateToken, async (req, res) => {
    const { id } = req.userData;
    try {
        const { name, email, _id } = await User.findById(id);
        res.json({ name, email, _id });
    } catch (err) {
        res.status(500).json('Internal server error');
    }
});

app.post('/logout', (req, res) => {
    res.clearCookie('token').json(true);
});

app.post('/upload-by-link', async (req, res) => {
    const { link } = req.body;
    const newName = 'photo' + Date.now() + '.jpg';
    await imageDownloader.image({
        url: link,
        dest: __dirname + '/uploads/' + newName,
    });
    res.json(newName);
});

const photosMiddleware = multer({ dest: 'uploads/' });
app.post('/upload', photosMiddleware.array('photos', 100), (req, res) => {
    const uploadedFiles = [];
    for (let i = 0; i < req.files.length; i++) {
        const { path, originalname } = req.files[i];
        const parts = originalname.split('.');
        const ext = parts[parts.length - 1];
        const newPath = path + '.' + ext;
        fs.renameSync(path, newPath);
        uploadedFiles.push(newPath.replace("uploads\\", ''));
    }
    res.json(uploadedFiles);
});

app.post('/gallery', (req, res) => {
    const { token } = req.cookies;
    const { title, addedPhotos, description } = req.body;
    jwt.verify(token, jwtSecret, {}, async (err, userData) => {
        if (err) throw err;
        const itemsDoc = await Item.create({
            owner: userData.id,
            title,
            photos: addedPhotos,
            description,
        });
        res.json(itemsDoc);
    });
});

app.get('/gallery', async (req, res) => {
    try {
        const token = req.cookies.token;
        let items = [];

        if (token) {
            jwt.verify(token, jwtSecret, async (err, userData) => {
                if (err) {
                    items = await Item.find();
                } else {
                    items = await Item.find({ owner: { $ne: userData.id } });
                }
                res.json(items);
            });
        } else {
            items = await Item.find();
            res.json(items);
        }
    } catch (err) {
        res.status(500).json('Internal server error');
    }
});


app.get('/gallery/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const item = await Item.findById(id);
        if (item) {
            res.json(item);
        } else {
            res.status(404).json('Item not found');
        }
    } catch (err) {
        res.status(500).json('Internal server error');
    }
});

app.put('/gallery', async (req, res) => {
    const { token } = req.cookies;
    const { id, title, addedPhotos, description } = req.body;
    jwt.verify(token, jwtSecret, {}, async (err, userData) => {
        if (err) throw err;
        const itemsDoc = await Item.findById(id);
        if (itemsDoc && userData.id === itemsDoc.owner.toString()) {
            itemsDoc.set({
                title,
                photos: addedPhotos,
                description,
            });
            await itemsDoc.save();
            res.json('ok');
        } else {
            res.status(404).json('Item not found');
        }
    });
});

app.listen(4000, () => {

});
