const serverless = require("serverless-http");
const app = require("../../dist/app").default;
const connectDB = require("../../dist/config/db").default;

const expressHandler = serverless(app);
const functionPath = "/.netlify/functions/api";

exports.handler = async (event, context) => {
  await connectDB();

  const requestPath = event.rawPath || event.path || "/";
  let apiPath;

  if (requestPath === functionPath) {
    apiPath = "/api";
  } else if (requestPath.startsWith(`${functionPath}/`)) {
    apiPath = `/api${requestPath.slice(functionPath.length)}`;
  } else if (requestPath === "/api" || requestPath.startsWith("/api/")) {
    apiPath = requestPath;
  } else {
    apiPath = `/api${requestPath.startsWith("/") ? requestPath : `/${requestPath}`}`;
  }

  return expressHandler({
    ...event,
    path: apiPath,
    rawPath: apiPath,
  }, context);
};
