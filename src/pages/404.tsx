import { StatusCodes } from "http-status-codes";
import ErrorPage from "./_error";

const Error404 = () => <ErrorPage statusCode={StatusCodes.NOT_FOUND} />;
export default Error404;
