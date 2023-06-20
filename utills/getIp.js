// import os from "os";
// const getIp = async (req, res, next) => {
//   const networkInterfaces = os.networkInterfaces();
//   let ipAddress;

//   // Find the first non-internal IPv4 address
//   Object.values(networkInterfaces).forEach((interfaces) => {
//     interfaces.forEach((interfaceInfo) => {
//       if (!interfaceInfo.internal && interfaceInfo.family === "IPv4") {
//         ipAddress = interfaceInfo.address;
//         return;
//       }
//     });
//   });

//   res.send(`Your machine's IP address is: ${ipAddress}`);
// };
// export { getIp };
import os from "os";
import axios from "axios";

const getIp = async (req, res) => {
  const networkInterfaces = os.networkInterfaces();
  let ipAddress = null;

  // Find the first non-internal IPv4 address
  Object.values(networkInterfaces).forEach((interfaces) => {
    interfaces.forEach((interfaceInfo) => {
      if (!interfaceInfo.internal && interfaceInfo.family === "IPv4") {
        ipAddress = interfaceInfo.address;
        return;
      }
    });
  });
  const interfaces = os.networkInterfaces();
  let localMachineIp = null;

  Object.values(interfaces).forEach((ifaceList) => {
    ifaceList.forEach((iface) => {
      if (iface.family === "IPv4" && !iface.internal) {
        localMachineIp = iface.address;
      }
    });
  });

  const response = await axios.get("https://api.ipify.org?format=json");
  const publicIpAddress = response.data.ip;

  const localIP = req.ip;

  const HeaderIpAddress =
    req.headers["x-forwarded-for"] || req.connection.remoteAddress;

  const realIpAddress =
    req.headers["x-real-ip"] || req.connection.remoteAddress;
  const socketIp = req.socket.localAddress;

  res.json({
    ipAddress,
    localIP,
    HeaderIpAddress,
    realIpAddress,
    socketIp,
    publicIpAddress,
    localMachineIp,
  });
};

export { getIp };
