import mongoose from "mongoose";

const locationSchema = mongoose.Schema({
  ip: {
    type: String,
    required: true,
  },
  locationName: {
    type: String,
    required: true,
  },
  startTime: {
    type: Date,
  },
  endTime: {
    type: Date,
  },
  hours: {
    type: Number,
  },
});

const attendanceSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    locations: [locationSchema],
    totalHours: {
      type: Number,
    },
    attendance: {
      type: String,
      default: "absent",
      enum: ["absent", "present", "halfday"],
    },
  },
  {
    timestamps: true,
  }
);

const Attendance = mongoose.model("Attendance", attendanceSchema);

export default Attendance;
