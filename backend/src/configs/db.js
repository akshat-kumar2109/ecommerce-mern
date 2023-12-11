import mongoose from "mongoose";

const connectToDB = () => {
  mongoose
    .connect(process.env.MONGODB_URI)
    .then(() => console.log("\x1b[44m%s\x1b[0m", "DB is connected"))
    .catch((error) => console.error("\x1b[31m%s\x1b[0m", "Error connecting to MongoDB:", error));
};

export default connectToDB;
