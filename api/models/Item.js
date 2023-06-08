const mongoose = require('mongoose');

const itemSchema = new mongoose.Schema({
    owner: {type:mongoose.Schema.Types.ObjectId, ref:'User'},
    title: String,
    photos: [String],
    description: String,
});

const ItemModel = mongoose.model('Item', itemSchema);

module.exports = ItemModel;