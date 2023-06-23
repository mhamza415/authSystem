import mongoose from "mongoose";

const attendanceSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
    },
    hours: {
      type: Number,
      required: true,
    },
    minutes: {
      type: Number,
      required: true,
    },
    ips: {
      type: Object,
      required: true,
    },
    attendanceStatus: {
      type: String,
      enum: ["absent", "halfday", "present"],
      required: true,
    },
  },

  {
    timestamps: true,
  }
);

const markAttendance = mongoose.model("markAttendance", attendanceSchema);

// export default markAttendance;
export default markAttendance;
