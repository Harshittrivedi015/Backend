const Package = require("../models/Package");
const mongoose = require("mongoose");


// add packages


exports.addPackage = async (req, res) => {
  try {
    const {
      name, image, price, description,
      category, duration, origin, destination,
      train, cab, hotel, meal, ratings
    } = req.body;

    if (!name || !image || !price || !description || !category || !duration || !origin || !destination) {
      return res.status(400).json({ error: "All required fields must be filled." });
    }

    const newPackage = new Package({
      name, image, price, description,
      category, duration, origin, destination,
      train, cab, hotel, meal,
      rating: ratings || 0
    });

    await newPackage.save();
    res.status(201).json({ message: "Package added successfully", package: newPackage });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};



// Get all packages

exports.getPackages = async (req, res) => {
    try {
      const packages = await Package.find();
      res.status(200).json(packages);
    } catch (error) {
      console.error("Error fetching packages:", error);
      res.status(500).json({ error: "Failed to fetch packages." });
    }
  };

  // all package find
  exports.getPackagesById = async function(req, res) {
    try {
      const packageId = req.params.id;
      const package = await Package.findById(packageId); // You can add filters here if needed
  
      res.json({
        message: "package fetched successfully",
        users: package
      });
    } catch (err) {
      res.status(500).json({ message: "Server error", error: err.message });
    }
  };


  // UPDATE package by ID
  exports.updatePackage = async (req, res) => {
    const { id } = req.params;
    const {
      name, image, price, description,
      category, duration, origin, destination,
      train, cab, hotel, meal, rating
    } = req.body;
  
    try {
      const updated = await Package.findByIdAndUpdate(
        id,
        {
          name, image, price, description,
          category, duration, origin, destination,
          train, cab, hotel, meal, rating,
        },
        { new: true, runValidators: true }
      );
  
      if (!updated) return res.status(404).json({ message: "Package not found" });
      res.status(200).json({ message: "Package updated", package: updated });
    } catch (err) {
      res.status(500).json({ message: "Server error" });
    }
  };
  


// DELETE a package by ID
exports.deletePackage = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: "Invalid package ID" });
  }

  try {
    const deletedPackage = await Package.findByIdAndDelete(id);
    if (!deletedPackage) {
      return res.status(404).json({ message: "Package not found" });
    }

    res.status(200).json({ message: "Package deleted successfully" });
  } catch (error) {
    console.error("Delete error:", error);
    res.status(500).json({ message: "Server error" });
  }
};



