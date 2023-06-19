import mongoose from "mongoose";
const ipSchema = mongoose.Schema({
  ip: {
    type: String,
    required: true,
    unique: true,
  },
  location: {
    type: String,
    required: true,
  },
});
const IpAddress = mongoose.model("IpAddress", ipSchema);
export default IpAddress;
