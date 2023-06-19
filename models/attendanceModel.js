import mongoose from "mongoose";

const attendanceSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    ip: {
      type: String,
      required: true,
    },
    startTime: {
      type: Date,
    },
    endTime: {
      type: Date,
    },
    location: {
      type: String,
      required: true,
    },
    hours: {
      type: Number, // or String, depending on requirement
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
