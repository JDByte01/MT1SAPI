var express = require('express');
var router = express.Router();

const bodyParser = require('body-parser');
const cors = require('cors');

router.use(bodyParser.json());
router.use(cors());

router.get('/', function(req, res, next) {
  res.render('index', { title: 'Mantto' });
});

module.exports = router;
