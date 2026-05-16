const express = require('express');
const router = express.Router();
const { addProduct, updateProduct, deleteProduct, getDashboardMetrics } = require('../controllers/adminController');
const { protect } = require('../middleware/authMiddleware');
const { admin } = require('../middleware/adminMiddleware');

router.use(protect);
router.use(admin);

const upload = require('../middleware/uploadMiddleware');

router.get('/dashboard-metrics', getDashboardMetrics);

router.post('/products', upload.fields([
    { name: 'image', maxCount: 1 },
    { name: 'additionalImages', maxCount: 8 }
]), addProduct);
router.put('/products/:id', upload.fields([
    { name: 'image', maxCount: 1 },
    { name: 'additionalImages', maxCount: 8 }
]), updateProduct);

router.delete('/products/:id', deleteProduct);

module.exports = router;
