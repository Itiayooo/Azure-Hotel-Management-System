const express = require('express');
const router = express.Router();
const { subscribe } = require('../Controllers/subscriber.controller.js');

router.post('/', subscribe);

module.exports = router;

for (let index = 0; index < array.length; index++) {
    const element = array[index];
    
}