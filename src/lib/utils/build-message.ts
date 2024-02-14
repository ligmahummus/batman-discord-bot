/**
 * Build a message using the factory startegy.
 */
export class BuildMessage {
  private message: string[] = [];

  public build() {
    return this.message.join("\n");
  }

  public addMessage(message: string) {
    this.message.push(message);
    return this;
  }

  public static boldUnderscore(message: string) {
    return `__**${message}**__`;
  }
}
