import mongoose from "mongoose";
import Attendance from "../models/attendanceModel.js";
import IpAddress from "../models/ipModel.js";
import { Types } from "mongoose";

const attendanceRegister = async (userId, ip) => {
  let availableIp = ip;
  if (availableIp.startsWith("::ffff:")) {
    availableIp = availableIp.slice("::ffff:".length);
  }

  const checkedIp = await IpAddress.findOne({ ip: availableIp });
  //   if (checkedIp) {
  //     attendanceData.location = checkedIp.location;
  //   }

  let attendanceData = {
    user: userId,
    ip: availableIp,
    startTime: new Date(),
    location: checkedIp ? checkedIp.location : "remote",
  };

  // Store attendanceData in the Attendance model
  const createdAttendance = await Attendance.create(attendanceData);

  // Calculate and update the hours if required
  // ... (add your logic here)

  return createdAttendance;
};

// @ Logout
// Access protect
const attendanceOut = async (req, res, next) => {
  try {
    if (req.session.userSessionId) {
      const { ObjectId } = Types;
      const userId = req.user._id; // Assuming the authenticated user's ID is available in req.user
      // Update the attendance record for the user with the current date and time as the endTime
      const attendance = await Attendance.findOneAndUpdate(
        { user: userId, endTime: { $exists: false } }, // Find the attendance record for the user with no endTime
        { endTime: new Date() }, // Set the endTime to the current date and time
        { new: true } // Return the updated attendance record
      );

      if (!attendance) {
        return res
          .status(400)
          .json({ message: "No active attendance record found" });
      }
      // calculateHours logic
      const calculateHours = (startTime, endTime) => {
        const duration = Math.abs(endTime - startTime);
        const hours = duration / (1000 * 60 * 60); // Convert duration from milliseconds to hours
        return hours;
      };

      // Calculate the hours based on the startTime and endTime
      const hours = calculateHours(attendance.startTime, attendance.endTime);

      // Update the attendance record with the calculated hours
      attendance.hours = hours;
      await attendance.save();

      // calculateTotalHours function or logic

      const calculateTotalHours = async (userId) => {
        const totalAttendance = await Attendance.aggregate([
          {
            $match: {
              user: new ObjectId(userId), // Use ObjectId constructor to convert userId to ObjectId
              endTime: { $exists: true },
            },
          },
          {
            $group: {
              _id: null,
              totalHours: { $sum: "$hours" },
            },
          },
        ]);

        return totalAttendance.length > 0 ? totalAttendance[0].totalHours : 0;
      };

      // Calculate the total hours for the user based on their attendance records
      const totalHours = await calculateTotalHours(userId);
      // calculateAttendanceStatus logic
      const calculateAttendanceStatus = (totalHours) => {
        if (totalHours > 7.5) {
          if (totalHours < 3) {
            return "absent";
          } else if (totalHours >= 3 && totalHours < 5) {
            return "halfday";
          } else if (totalHours >= 5) {
            return "present";
          }
        } else {
          return "absent";
        }
      };

      // Perform attendance status calculation based on total hours
      const attendanceStatus = calculateAttendanceStatus(totalHours);

      // Update the attendance record with the attendance status
      attendance.attendance = attendanceStatus;
      await attendance.save();
      // logout logic
      delete req.session.userSessionId;

      res.json({ message: "Logout successful", attendance });
    } else {
      res.json("user already logged out");
    }
  } catch (error) {
    next(error);
  }
};

export { attendanceRegister, attendanceOut };
