const express = require('express');
// const { request, response } = require('../../app');
const router = express.Router();

router.get('/', (req, res) => {
    res.status(201).send({admin: 'admin'})
})

module.exports = router;