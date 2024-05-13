const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");

const RecordSchema = new mongoose.Schema({
  medical_record_number: String,
  name: String,
  health_insurance_number: String,
  rank: String,
  registration_number: String,
  unitary_part: String,
  health_service_provider: String,
  position: String,
  status: Boolean,
  borrower: String,
  createdAt: Number,
  updatedAt: Number,
  histories: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "histories",
    },
  ],
});

RecordSchema.plugin(mongoosePaginate);

const RecordModel = mongoose.model("records", RecordSchema);
module.exports = RecordModel;
