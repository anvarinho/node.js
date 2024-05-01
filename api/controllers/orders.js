const mongoose = require('mongoose')
const Order = require('../models/order')
const Place = require('../models/place')

exports.get_orders = (req, res, next) => {
    Order.find()
    .select('place quantity _id')
    .populate('place', 'name')
    .exec()
    .then(docs => {
        res.status(200).json(docs)
    }).catch(err => {
        console.log(err);
        res.status(500).json({
            error: err 
        })
    })
}

exports.create_order = (req, res, next) => {
    Place.findById(req.body.placeId)
    .then(product => {
      if (!product) {
        return res.status(404).json({
          message: "Product not found"
        });
      }
      const order = new Order({
        _id: new mongoose.Types.ObjectId(),
        quantity: req.body.quantity,
        place: req.body.placeId
      });
      return order.save();
    })
    .then(result => {
      console.log(result);
      res.status(201).json({
        message: "Order stored",
        createdOrder: {
          _id: result._id,
          place: result.place,
          quantity: result.quantity
        },
        request: {
          type: "GET",
          url: "http://localhost:3000/orders/" + result._id
        }
      });
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        error: err
      });
    });
}

exports.get_order_by_id = (req, res, next) => {
    Order.findById(req.params.orderId)
        .populate('place')
        .exec()
        .then(order => {
            if (!order) {
                return res.status(404).json({
                message: "Order not found"
                });
            }
            res.status(200).json({
                order: order,
            });
        })
        .catch(err => {
            res.status(500).json({
                error: err
            });
        });
}

exports.delete_order = (req, res, next) => {
    Order.deleteOne({_id: req.params.orderId})
        .exec()
        .then(result => {
            if (result.deletedCount === 1) {
                res.status(200).json({ message: 'Order deleted successfully', orderId: req.params.orderId });
            } else {
                res.status(404).json({ message: 'Order not found' });
            }
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
}