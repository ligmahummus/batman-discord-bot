import Subscriber from "./model/subscriber";

export class SubscriberService {
  private static async subscribe(id: string, username: string): Promise<void> {
    try {
      if (await this.getSubscriber(id)) {
        await this.setSubscribe(id, true);
      } else {
        const subscriber = new Subscriber({ id, username, subscribed: true });
        await subscriber.save();
      }
    } catch (error) {
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
    subscribed: boolean
  ): Promise<void> {
    try {
      await Subscriber.findOneAndUpdate({ id }, { subscribed });
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
      await this.subscribe(user.id, user.username);
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
}

export type SubUser = {
  id: string;
  username: string;
  subscribed?: boolean;
};

type SubUserDocument = SubUser & { subscribed: boolean };
