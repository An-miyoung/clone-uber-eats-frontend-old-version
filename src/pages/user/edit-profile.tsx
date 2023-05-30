import { gql, useApolloClient, useMutation } from "@apollo/client";
import React from "react";
import useMe from "../../hooks/useMe";
import Button from "../../components/button";
import { useForm } from "react-hook-form";
import {
  editProfile,
  editProfileVariables,
} from "../../__generated__/editProfile";
import FormError from "../../components/form-error";

interface IFormProps {
  email?: string;
  password?: string;
}

const EDIT_PROFILE_MUTATION = gql`
  mutation editProfile($input: EditProfileInput!) {
    editProfile(input: $input) {
      ok
      error
    }
  }
`;

const EditProfile = () => {
  const client = useApolloClient();
  const { data: userData } = useMe();
  const { register, handleSubmit, errors, getValues, formState } =
    useForm<IFormProps>({
      mode: "onChange",
      defaultValues: {
        email: userData?.me.email,
      },
    });

  const onCompleted = (data: editProfile) => {
    const {
      editProfile: { ok },
    } = data;
    if (ok && userData) {
      const {
        me: { email: cacheEmail, id },
      } = userData;
      const { email: inputEmail } = getValues();
      if (cacheEmail !== inputEmail) {
        client.writeFragment({
          id: `User:${id}`,
          fragment: gql`
            fragment EditedUser on User {
              verified
              email
            }
          `,
          data: {
            verified: false,
            email: inputEmail,
          },
        });
      }
    }
  };

  const [editProfileMutaion, { loading }] = useMutation<
    editProfile,
    editProfileVariables
  >(EDIT_PROFILE_MUTATION, {
    onCompleted,
  });

  const onSubmit = () => {
    const { email, password } = getValues();
    editProfileMutaion({
      variables: {
        input: {
          email,
          // password 가 빈 스트링이면 아예 object 안에 만들지 않기 위해서
          ...(password !== "" && { password }),
        },
      },
    });
  };

  return (
    <div className=" mt-36 mx-8 flex flex-col items-center justify-center">
      <h4 className=" font-semibold text-2xl mb-3">Edit Profile</h4>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="grid max-w-screen-sm gap-3 mt-5 mb-5 w-full"
      >
        <input
          ref={register({
            pattern:
              /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
          })}
          name="email"
          type="email"
          placeholder="이메일"
          className="input"
        />
        {errors.email?.message && (
          <FormError errorMessage={errors.email?.message} />
        )}
        {errors.email?.type === "pattern" && (
          <FormError errorMessage="유효하지 않은 이메일입니다." />
        )}
        <input
          ref={register}
          name="password"
          type="password"
          placeholder="5글자이상 9글자이하의 비밀번호"
          className="input"
        />
        <Button
          canClick={formState.isValid}
          loading={loading}
          actionText="프로필 수정"
        />
      </form>
    </div>
  );
};

export default EditProfile;
