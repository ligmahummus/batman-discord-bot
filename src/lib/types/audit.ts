import { PlayersInput } from "../utils/data-avarage";

export type AuditResponse = {
  start: string;
  end: string;
  data: PlayersInput[];
};
