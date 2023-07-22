const express = require('express');
const router = express.Router();

const OrdersController = require('../controllers/orders');

router.get('/', OrdersController.get_orders)

router.post('/', OrdersController.create_order)

router.get('/:orderId', OrdersController.get_order_by_id)

router.delete('/:orderId', OrdersController.delete_order)

module.exports = router;