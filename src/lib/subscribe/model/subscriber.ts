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
      required: true,
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
