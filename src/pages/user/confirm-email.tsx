import { gql, useApolloClient, useMutation } from "@apollo/client";
import React, { useEffect } from "react";
import {
  verifyEmail,
  verifyEmailVariables,
} from "../../__generated__/verifyEmail";
import { useHistory, useLocation } from "react-router-dom";
import useMe from "../../hooks/useMe";

const VERIFY_EMAIL_MUTATION = gql`
  mutation verifyEmail($input: VerifyEmailInput!) {
    verifyEmail(input: $input) {
      ok
      error
    }
  }
`;

const ConfirmEmail = () => {
  const client = useApolloClient();
  const { data: userData } = useMe();
  const history = useHistory();

  const onCompleted = (data: verifyEmail) => {
    const {
      verifyEmail: { ok },
    } = data;

    if (ok && userData?.me.id) {
      // apollo client cache 의 verified 를 직접 바꿔준다. 다시 캐싱할 필요없게
      client.writeFragment({
        id: `User:${userData.me.id}`,
        fragment: gql`
          fragment VerifiedUser on User {
            verified
          }
        `,
        data: {
          verified: true,
        },
      });
    }
    history.push("/");
  };

  const [verifyEmailMutation] = useMutation<verifyEmail, verifyEmailVariables>(
    VERIFY_EMAIL_MUTATION,
    {
      onCompleted,
    }
  );

  const location = useLocation();

  useEffect(() => {
    const [_, code] = location.search.split("code=");

    verifyEmailMutation({
      variables: {
        input: {
          code,
        },
      },
    });
  }, [location.search, verifyEmailMutation]);

  return (
    <div className="mt-36 mx-8 flex flex-col items-center justify-center">
      <h2 className=" text-lg mb- font-medium">Confirming email...</h2>
      <h4 className=" text-gray-700 text-sm">
        Please wait, don't close this page...
      </h4>
    </div>
  );
};

export default ConfirmEmail;
