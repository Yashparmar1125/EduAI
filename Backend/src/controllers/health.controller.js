import mongoose from "mongoose";
import os from "os";
import process from "process";

// Use the ES module export syntax
export const healthCheck = async (req, res) => {
  try {
    // Check MongoDB status
    const mongoStatus = mongoose.connection.readyState;
    const isMongoHealthy = mongoStatus === 1; // 1 means connected

    // Server resource stats (memory, uptime)
    const memoryUsage = process.memoryUsage();
    const uptime = os.uptime();

    // MongoDB health status
    const dbStatus = {
      status: isMongoHealthy ? "ok" : "error",
      lastChecked: new Date().toISOString(),
      mongoConnectionState: mongoStatus === 1 ? "Connected" : "Disconnected",
    };

    // Constructing response
    res.json({
      status: "ok",
      uptime: `${uptime} seconds`,
      memoryUsage: {
        rss: memoryUsage.rss, // Resident Set Size
        heapTotal: memoryUsage.heapTotal,
        heapUsed: memoryUsage.heapUsed,
        external: memoryUsage.external,
      },
      database: dbStatus,
      services: {
        externalAPI: {
          status: "ok", // Placeholder for external service health check
          lastChecked: new Date().toISOString(),
        },
      },
    });
  } catch (error) {
    // Handle error if health check fails
    console.error("Health check failed:", error);
    res.status(500).json({
      status: "error",
      message: "Health check failed",
      error: error.message,
    });
  }
};
