const router = require('express').Router();
const multer = require('multer');
const path = require('path');
const { authenticate, requireAdmin } = require('../middleware/auth');
const { getAll, getOne, create, update, remove } = require('../controllers/resourceController');

const storage = multer.diskStorage({
  destination: path.join(__dirname, '../uploads'),
  filename: (req, file, cb) => {
    const unique = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, unique + path.extname(file.originalname));
  },
});
const upload = multer({ storage });

router.get('/', getAll);
router.get('/:id', getOne);
router.post('/', authenticate, requireAdmin, upload.single('image'), create);
router.put('/:id', authenticate, requireAdmin, upload.single('image'), update);
router.delete('/:id', authenticate, requireAdmin, remove);

module.exports = router;
