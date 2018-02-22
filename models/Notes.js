const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const notesSchema = new Schema({
    date: { type: Date, default: Date() },
    semester: { type: Number, required: true },
    branch: { type: String, required: true },
    subject: { type: String, required: true },
    unit: { type: Array, required: true },
    description: { type: String, required: true },
    filename: { type: String, required: true },
    path: { type: String, required: true },
    ///save the user who is submitting the notes
    user: { type: Schema.Types.ObjectId, ref: 'users' }
})

const Notes = mongoose.model('note', notesSchema);
module.exports = Notes;