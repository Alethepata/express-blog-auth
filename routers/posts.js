const express = require('express');
const router = express.Router();

const { index, show, store, download, destroy } = require('../controllers/postsController');

const slugNotFound = require('../middleware/slugNotFound.js');
const access = require('../middleware/access.js');

const multer = require("multer");
const uploader = multer({dest: "public/imgs/posts"});


router.get('/', index);

router.post('/', access, uploader.single("image"), store);

router.get('/:slug', show);

router.delete('/:slug', slugNotFound, destroy);

router.get('/:slug/download', download);

module.exports = router;