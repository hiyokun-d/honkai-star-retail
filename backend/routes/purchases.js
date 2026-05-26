const router = require('express').Router();
const { authenticate, requireAdmin } = require('../middleware/auth');
const { purchase, getMyPurchases, getAllPurchases } = require('../controllers/purchaseController');

router.post('/', authenticate, purchase);
router.get('/my', authenticate, getMyPurchases);
router.get('/', authenticate, requireAdmin, getAllPurchases);

module.exports = router;
