import IpAddress from "../models/ipModel.js";

const addIpAddress = async (req, res) => {
  try {
    const { ip, location } = req.body;
    //   @DESC      input validation
    if (!(ip && location)) {
      res.status(400).send("All the inputs are required");
    }
    const ipExists = await IpAddress.findOne({ ip });
    if (ipExists) {
      res.status(400);
      throw new Error("user already exists...");
    }
    const newIp = await IpAddress.create({
      ip,
      location,
    });
    if (newIp) {
      res.status(201).json({
        _id: newIp._id,
        ip: newIp.ip,
        location: newIp.location,
      });
    } else {
      res.status(400);
      throw new Error("Invalid ip address");
    }
  } catch (error) {
    nextTick(error);
  }
};

// @desc    update IP Address
// @access  Protected
// @method  Put

const updateIpAddress = async (req, res, next) => {
  try {
    const { ip, location } = req.body;
    //   @DESC      input validation
    if (!(ip && location)) {
      res.status(400).send("All the inputs are required");
    }
    const ipExists = await IpAddress.findOne({ ip });
    if (ipExists) {
      res.status(400);
      throw new Error("ip already exists");
    }
    const newip = await IpAddress.findById(req.params.id);
    if (newip) {
      newip.ip = ip || newip.ip;
      newip.location = location || newip.location;

      const updatedIp = await newip.save();
      res.status(201).json({
        _id: updatedIp._id,
        ip: updatedIp.ip,
        location: updatedIp.location,
      });
    } else {
      res.status(404);
      throw new Error("IP not found");
    }
  } catch (error) {
    next(error);
  }
};
// @desc    Delete a Product
// @route   DELETE /api/products/:id
// @access  Private/Admin
const deleteIpAddress = async (req, res, next) => {
  try {
    const ip = await IpAddress.findById(req.params.id);

    if (ip) {
      await ip.deleteOne();
      res.json({ message: "IP removed" });
    } else {
      res.status(404);
      throw new Error("IP not found");
    }
  } catch (error) {
    next(error);
  }
};
const getIpAddress = async (req, res, next) => {
  try {
    const ip = await IpAddress.findById(req.params.id);
    if (ip) {
      res.json(ip);
    } else {
      res.status(404);
      throw new Error("ohh! IP not found");
    }
  } catch (error) {
    next(error);
  }
};

export { addIpAddress, updateIpAddress, deleteIpAddress, getIpAddress };
