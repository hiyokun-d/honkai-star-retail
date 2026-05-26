const router = require('express').Router();
const { token } = require('../controllers/oauthController');

router.post('/token', token);

module.exports = router;
