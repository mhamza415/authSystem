import mongoose from "mongoose";
import Attendance from "../models/attendanceModel.js";
import IpAddress from "../models/ipModel.js";

const attendanceRegister = async (userId, ip) => {
  let availableIp = ip;
  if (availableIp.startsWith("::ffff:")) {
    availableIp = availableIp.slice("::ffff:".length);
  }

  const checkedIp = await IpAddress.findOne({ ip: availableIp });

  const currentDate = new Date().toISOString().split("T")[0];
  const existingAttendance = await Attendance.findOne({
    user: userId,
    createdAt: {
      $gte: new Date(currentDate),
      $lt: new Date(new Date(currentDate).getTime() + 24 * 60 * 60 * 1000),
    },
  });

  if (existingAttendance) {
    // User has already created attendance today, update it
    const locationIndex = existingAttendance.locations.findIndex(
      (loc) => loc.ip === availableIp
    );
    if (locationIndex !== -1) {
      // IP exists in the locations array, update it
      existingAttendance.locations[locationIndex].locationName = checkedIp
        ? checkedIp.location
        : "remote";
      existingAttendance.locations[locationIndex].startTime = new Date();
      existingAttendance.locations[locationIndex].endTime = null; // Set endTime to null initially
    } else {
      // IP doesn't exist in the locations array, add it as a new location
      existingAttendance.locations.push({
        ip: availableIp,
        locationName: checkedIp ? checkedIp.location : "remote",
        startTime: new Date(),
        endTime: null,
      });
    }

    // Save the updated attendance
    await existingAttendance.save();

    return existingAttendance;
  }

  // User has not created attendance today, create a new one
  let attendanceData = {
    user: userId,
    locations: [
      {
        ip: availableIp,
        locationName: checkedIp ? checkedIp.location : "remote",
        startTime: new Date(),
        endTime: null,
      },
    ],
  };

  // Store attendanceData in the Attendance model
  const createdAttendance = await Attendance.create(attendanceData);

  return createdAttendance;
};

// @ Logout
// Access protect
const attendanceOut = async (req, res, next) => {
  try {
    if (req.session.userSessionId) {
      const userId = req.user._id;
      const currentDate = new Date();

      const attendance = await Attendance.findOne({
        user: userId,
        createdAt: {
          $gte: new Date(
            currentDate.getFullYear(),
            currentDate.getMonth(),
            currentDate.getDate()
          ),
          $lt: new Date(
            currentDate.getFullYear(),
            currentDate.getMonth(),
            currentDate.getDate() + 1
          ),
        },
      });
      if (!attendance) {
        // Attendance not found for the user
        return res.status(404).json({ error: "Attendance not found" });
      }
      // Find the location index with the endTime as null
      const locationIndex = attendance.locations.findIndex(
        (location) => location.endTime === null
      );

      if (locationIndex !== -1) {
        // Update the endTime and calculate hours for the location
        attendance.locations[locationIndex].endTime = currentDate;
        const startTime = attendance.locations[locationIndex].startTime;
        const endTime = attendance.locations[locationIndex].endTime;
        const hours = attendance.locations[locationIndex].hours || 0;
        attendance.locations[locationIndex].hours =
          hours + (endTime - startTime) / (1000 * 60 * 60);
      }

      // Calculate the total hours from all locations
      const totalHours = attendance.locations.reduce(
        (total, location) => total + location.hours,
        0
      );
      attendance.totalHours = totalHours;

      // Determine attendance status based on total hours
      let attendanceStatus = "absent";
      if (totalHours >= 3 && totalHours < 5) {
        attendanceStatus = "halfday";
      } else if (totalHours >= 5) {
        attendanceStatus = "present";
      }
      attendance.attendance = attendanceStatus;

      // Save the updated attendance
      await attendance.save();
      // now at end deleting session
      // Logout logic

      delete req.session.userSessionId;

      res
        .status(200)
        .json({ message: "Attendance updated successfully", attendance });
    } else {
      res.json("you are already logged out");
    }
  } catch (error) {
    next(error);
  }
};

export { attendanceRegister, attendanceOut };
