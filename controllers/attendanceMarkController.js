import markAttendance from "../models/attendanceMarkModel.js";

const attendanceMark = async (req, res) => {
  try {
    const response = await fetch(
      "https://champagne-bandicoot-hem.cyclic.app/api/data"
    );
    const responseBody = await response.text(); // Get the response body as text

    const parsedData = JSON.parse(responseBody); // Parse the response body as JSON

    // Step 2: Sort the array of objects based on the email
    parsedData.data.sort((a, b) => a.email.localeCompare(b.email));

    // Step 3: Accumulate hours for each email and IP address
    const accumulatedHours = {};

    parsedData.data.forEach((obj) => {
      const { email, total_time, ip_address } = obj;
      const [hours, minutes] = total_time ? total_time.split(":") : [0, 0];
      const totalMinutes = parseInt(hours) * 60 + parseInt(minutes);

      if (!isNaN(totalMinutes)) {
        if (!accumulatedHours[email]) {
          accumulatedHours[email] = {
            email,
            hours: 0,
            minutes: 0,
            ips: {},
          };
        }
        accumulatedHours[email].hours += parseInt(hours);
        accumulatedHours[email].minutes += parseInt(minutes);
        if (!accumulatedHours[email].ips[ip_address]) {
          accumulatedHours[email].ips[ip_address] = 0;
        }
        accumulatedHours[email].ips[ip_address] += totalMinutes;
      }
    });

    // Step 4: Adjust hours and minutes
    for (const email in accumulatedHours) {
      let { hours, minutes } = accumulatedHours[email];
      hours += Math.floor(minutes / 60);
      minutes %= 60;
      accumulatedHours[email].hours = hours;
      accumulatedHours[email].minutes = minutes;

      // Step 5: Determine attendance status based on total hours
      let attendanceStatus = "absent";
      const totalHours = hours + minutes / 60;
      if (totalHours >= 3 && totalHours < 5) {
        attendanceStatus = "halfday";
      } else if (totalHours >= 5) {
        attendanceStatus = "present";
      }
      accumulatedHours[email].attendanceStatus = attendanceStatus;
    }

    // Step 6: Create an array of markAttendance instances
    const attendanceInstances = Object.values(accumulatedHours).map(
      (data) => new markAttendance(data)
    );

    // Step 7: Save attendance instances to the database
    await markAttendance.insertMany(attendanceInstances);

    // Step 8: Output the result
    res.status(200).json(attendanceInstances);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send("Internal Server Error");
  }
};

export { attendanceMark };
