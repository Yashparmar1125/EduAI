import mongoose from "mongoose";

const roadmapSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  roadmap: {
    type: String,
    required: true,
  },
});

const Roadmap = mongoose.model("Roadmap", roadmapSchema);

export default Roadmap;
