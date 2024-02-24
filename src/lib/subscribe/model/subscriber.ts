import { model, models, Schema } from "mongoose";

const subscriberSchema = new Schema(
  {
    id: {
      type: String,
      required: true,
      unique: true,
    },
    username: {
      type: String,
      required: true,
    },
    avatar: {
      type: String,
      default:
        "https://i.pinimg.com/474x/5c/be/a6/5cbea638934c3a0181790c16a7832179.jpg",
    },
    subscribed: {
      type: Boolean,
      required: true,
    },
  },
  { timestamps: true }
);

const subscriberModel =
  models.Subscriber || model("Subscriber", subscriberSchema);

export default subscriberModel;
