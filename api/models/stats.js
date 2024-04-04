const mongoose = require('mongoose');

const statsSchema = new mongoose.Schema({
    timestamp: { type: Date, default: Date.now },
    route: { type: String },
    statusCode: { type: Number },
    method: { type: String, required: true },
    language: { type: String },
    sessionID: { type: String },
    remoteAddress: { type: String },
    query: { type: mongoose.Schema.Types.Mixed },
    requestHeaders: { type: mongoose.Schema.Types.Mixed },
});

const Statistics = mongoose.model('Statistics', statsSchema);

module.exports = Statistics;
