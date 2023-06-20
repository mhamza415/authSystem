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
  const localIP = req.ip;

  const HeaderIpAddress =
    req.headers["x-forwarded-for"] || req.connection.remoteAddress;

  const realIpAddress =
    req.headers["x-real-ip"] || req.connection.remoteAddress;
  const socketIp = req.socket.localAddress;

  res.json({ ipAddress, localIP, HeaderIpAddress, realIpAddress, socketIp });
};

export { getIp };
("x-real-ip");
