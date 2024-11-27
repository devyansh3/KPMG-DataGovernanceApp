const { ROLES } = require("../utils/constants");

function ownerPermission(req, res, next) {
  const userRole = req.user.role; // Extract the user role from the request object
  console.log("User Role:", userRole);

  // Handle permissions based on the user's role
  if (userRole === ROLES.ADMIN) {
    // ADMIN has full access
    return next();
  } else if (userRole === ROLES.ASSOCIATE) {
    // ASSOCIATE can only POST (create)
    if (req.method === "POST") {
      return next();
    } else {
      // Deny other operations for ASSOCIATE
      return res
        .status(403)
        .json({ message: "Access Denied. Insufficient permissions." });
    }
  } else {
    // For any other roles or no valid role
    return res
      .status(403)
      .json({ message: "Access Denied. Insufficient permissions." });
  }
}

function locationPermission(req, res, next) {
  const userStoreId = req.user.activeStoreUser.storeId._id; // User's active store ID
  const requestedStoreId = req.params.storeId; // Store ID from the route params

  // Ensure the user can only access their own store
  if (userStoreId.equals(requestedStoreId)) {
    next(); // Proceed if store IDs match
  } else {
    res.status(403).json({
      message: "Access Denied. You can only modify bookings for your own store.",
    });
  }
}

module.exports = { ownerPermission, locationPermission };
