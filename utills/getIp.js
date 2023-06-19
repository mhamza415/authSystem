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

const getIp = async () => {
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

  return ipAddress;
};

export { getIp };