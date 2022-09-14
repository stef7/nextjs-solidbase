import { StatusCodes } from "http-status-codes";
import { createErrorMembers } from "./_error";

const errorMembers = createErrorMembers(StatusCodes.FORBIDDEN);
export const getServerSideProps = errorMembers.getServerSideProps;
export default errorMembers.ErrorXPageComponent;
