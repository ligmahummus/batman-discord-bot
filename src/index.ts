import {
  APIGatewayProxyEvent,
  APIGatewayProxyResultV2,
  Handler,
} from "aws-lambda";
import { main } from "./bot";

/**
 * AWS Lambda handler function.
 * @see https://www.youtube.com/watch?v=UQiRhKgQ5X0
 */
export const handler: Handler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResultV2> => {
  main();
  return {
    statusCode: 200,
    body: "Hello from lambda!",
  };
};
