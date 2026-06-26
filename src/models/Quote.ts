import mongoose from "mongoose";

const QuoteSchema = new mongoose.Schema(
  {
    fullName: String,
    email: String,
    phone: String,
    company: String,
    service: String,
    projectDetails: String,
    quantity: String,
    deadline: String,
    country: String,

    status: {
      type: String,
      default: "New",
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.Quote ||
  mongoose.model("Quote", QuoteSchema);