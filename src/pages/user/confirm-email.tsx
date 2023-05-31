import { gql, useMutation } from "@apollo/client";
import React, { useEffect } from "react";
import {
  verifyEmail,
  verifyEmailVariables,
} from "../../__generated__/verifyEmail";
import { useHistory, useLocation } from "react-router-dom";
import useMe from "../../hooks/useMe";
import { Helmet } from "react-helmet-async";

const VERIFY_EMAIL_MUTATION = gql`
  mutation verifyEmail($input: VerifyEmailInput!) {
    verifyEmail(input: $input) {
      ok
      error
    }
  }
`;

const ConfirmEmail = () => {
  const { data: userData, refetch } = useMe();
  const history = useHistory();

  const onCompleted = async (data: verifyEmail) => {
    const {
      verifyEmail: { ok },
    } = data;

    if (ok && userData?.me.id) {
      // 방법1 : apollo client cache 의 verified 를 직접 바꿔준다. 다시 캐싱할 필요없게
      // client.writeFragment({
      //   id: `User:${userData.me.id}`,
      //   fragment: gql`
      //     fragment VerifiedUser on User {
      //       verified
      //     }
      //   `,
      //   data: {
      //     verified: true,
      //   },
      // });

      // 방법2 : useQuery 가 제공하는 refetch 를 이용해 backend를 다시 읽어오면 cache 는 자동refresh
      // confirm email은 이메일주소를 바꾼 후 일어나는 경우에 user data 가 바꿔서 어차피 refetch 가 일어나야 한다.
      await refetch();
      history.push("/");
    }
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
      <Helmet>
        <title>Verify Email | Nuber Eats</title>
      </Helmet>
      <h2 className=" text-lg mb- font-medium">Confirming email...</h2>
      <h4 className=" text-gray-700 text-sm">
        Please wait, don't close this page...
      </h4>
    </div>
  );
};

export default ConfirmEmail;
