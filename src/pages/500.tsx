import { StatusCodes } from "http-status-codes";
import ErrorPage from "./_error";

const Error500 = () => <ErrorPage statusCode={StatusCodes.INTERNAL_SERVER_ERROR} />;
export default Error500;
