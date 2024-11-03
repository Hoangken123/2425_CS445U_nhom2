const express = require('express');
const router = express.Router();

// Định nghĩa một route đơn giản
router.get('/', (req, res) => {
    res.send('Hello from API!');
});

module.exports = router;
