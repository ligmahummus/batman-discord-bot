import Subscriber from "./model/subscriber";

export class SubscriberService {
  private static async subscribe(
    id: string,
    username: string,
    avatar: string
  ): Promise<void> {
    try {
      if (await this.getSubscriber(id)) {
        await this.setSubscribe(id, true, avatar);
      } else {
        const subscriber = new Subscriber({
          id,
          username,
          subscribed: true,
          avatar,
        });
        await subscriber.save();
      }
    } catch (error) {
      console.log("🚀 ~ SubscriberService ~ error:", error);
      throw new Error("Error subscribing user");
    }
  }

  private static async unsubscribe(id: string): Promise<void> {
    try {
      await this.setSubscribe(id, false);
    } catch (error) {
      throw new Error("Error unsubscribing user");
    }
  }

  private static async isSubscribed(id: string): Promise<boolean> {
    try {
      const subscriber = await this.getSubscriber(id);
      if (subscriber) return subscriber.subscribed;
      else return false;
    } catch (error) {
      throw new Error("Error checking if user is subscribed");
    }
  }

  private static async setSubscribe(
    id: string,
    subscribed: boolean,
    avatar?: string
  ): Promise<void> {
    try {
      const payload = avatar ? { subscribed, avatar } : { subscribed };
      console.log("🚀 ~ SubscriberService ~ payload:", payload);
      await Subscriber.findOneAndUpdate({ id }, payload);
    } catch (error) {
      throw new Error("Error setting subscription status");
    }
  }

  private static async getSubscriber(
    id: string
  ): Promise<SubUserDocument | null> {
    try {
      const subscriber = await Subscriber.findOne({ id });
      return subscriber;
    } catch (error) {
      throw new Error("Error getting subscriber");
    }
  }

  /**
   * Hnadles the subscribe operation
   * @param id string
   * @returns true if the user is subscribed after the operation, false otherwise
   */
  public static async handleSubscribe(user: SubUser): Promise<boolean> {
    const isSub = await this.isSubscribed(user.id);
    if (isSub) {
      await this.unsubscribe(user.id);
    } else {
      await this.subscribe(user.id, user.username, user.avatar);
    }

    return !isSub;
  }

  public static async getSubscribers(): Promise<string[]> {
    try {
      const subscribers = await Subscriber.find({ subscribed: true });
      return subscribers.map((sub) => sub.id);
    } catch (error) {
      return [];
    }
  }

  public static getAvatarUrl(id: string, avatar: string): string {
    return `https://cdn.discordapp.com/avatars/${id}/${avatar}.webp?size=128`;
  }

  public static async getSubscribersByUsername(): Promise<
    { username: string; avatar: string }[]
  > {
    try {
      const subscribers = await Subscriber.find({ subscribed: true });
      return subscribers.map((sub) => ({
        username: sub.username,
        avatar: sub.avatar,
      }));
    } catch (error) {
      return [];
    }
  }
}

export type SubUser = {
  id: string;
  username: string;
  avatar: string;
  subscribed?: boolean;
};

type SubUserDocument = SubUser & { subscribed: boolean };
