import { getReasonPhrase, StatusCodes } from "http-status-codes";
import NextError, { ErrorProps } from "next/error";
import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import { PropsWithChildren } from "react";
import { Container } from "~/components/organisms/Container";

type ErrorPageFC = React.FC<PropsWithChildren<ErrorProps>> & {
  getInitialProps: typeof NextError["getInitialProps"];
};

const ErrorPage: ErrorPageFC = ({ statusCode, title, children }) => {
  const phrase = statusCode ? getReasonPhrase(statusCode) : undefined;
  const info = title || phrase;
  const heading = (info && (/error/gi.test(info) ? info : `Error: ${info}`)) || "Error";
  return (
    <Container>
      <div className="prose mx-auto">
        <h1>{heading}</h1>
        <p>
          An error {statusCode} {phrase && phrase !== title && `(${phrase})`} occurred.
        </p>
        {phrase !== title && <p>{title}</p>}
        <div>{children}</div>
      </div>
    </Container>
  );
};
ErrorPage.getInitialProps = ({ res, err }) => {
  const statusCode = res?.statusCode ?? err?.statusCode ?? StatusCodes.NOT_FOUND;
  const title = res?.statusMessage || err?.message || getReasonPhrase(statusCode);
  return { statusCode, title };
};
export default ErrorPage;

export const createErrorMembers = <C extends StatusCodes>(statusCode: C) => {
  const getServerSideProps: GetServerSideProps<{ statusCode: C }> = async ({ res }) => {
    res.statusCode = statusCode;
    return { props: { statusCode } };
  };
  const ErrorXPageComponent: React.FC<InferGetServerSidePropsType<typeof getServerSideProps>> = ({ statusCode }) => (
    <ErrorPage statusCode={statusCode} />
  );
  return {
    getServerSideProps,
    ErrorXPageComponent,
  };
};
