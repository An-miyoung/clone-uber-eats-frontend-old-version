import React from "react";
import { useForm } from "react-hook-form";
import FormError from "../components/form-error";
import { gql, useMutation } from "@apollo/client";
import { Helmet } from "react-helmet-async";
import uberLogo from "../images/logo.svg";
import Button from "../components/button";
import { Link, useHistory } from "react-router-dom";
import {
  createAccountMutation,
  createAccountMutationVariables,
} from "../__generated__/createAccountMutation";
import { UserRole } from "../__generated__/globalTypes";

const CREATE_ACCOUNT_MUTATION = gql`
  mutation createAccountMutation($createAccountInput: CreateAccountInput!) {
    createAccount(input: $createAccountInput) {
      ok
      error
    }
  }
`;

interface ICreateAccountForm {
  email: string;
  password: string;
  role: UserRole;
}

const CreateAccount = () => {
  const history = useHistory();
  const { register, errors, getValues, handleSubmit, formState } =
    useForm<ICreateAccountForm>({
      mode: "onBlur",
      defaultValues: {
        role: UserRole.Client,
      },
    });

  const onCompleted = (data: createAccountMutation) => {
    const {
      createAccount: { ok },
    } = data;
    if (ok) {
      history.push("/login");
    }
  };

  const [
    createAccountMutation,
    { data: createAccountMutationResult, loading },
  ] = useMutation<createAccountMutation, createAccountMutationVariables>(
    CREATE_ACCOUNT_MUTATION,
    {
      onCompleted,
    }
  );

  const onSubmit = () => {
    if (!loading) {
      const { email, password, role } = getValues();
      createAccountMutation({
        variables: {
          createAccountInput: {
            email,
            password,
            role,
          },
        },
      });
    }
  };

  return (
    <div className="h-screen flex items-center flex-col mt-10 lg:mt-28">
      <Helmet>
        <title>Create Account | Nuber Eats</title>
      </Helmet>
      <div className="w-full max-w-screen-sm flex flex-col px-5 items-center">
        <img src={uberLogo} className="w-52 mb-10" alt="Uber Logo" />
        <h4 className=" w-full font-medium text-left text-3xl mb-5">
          Let's get started
        </h4>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className=" grid gap-3 mt-5 mb-5 w-full"
        >
          <input
            ref={register({
              required: "필수항목입니다.",
              pattern:
                /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
            })}
            name="email"
            placeholder="이메일"
            type="email"
            className="input"
            required
          />
          {errors.email?.message && (
            <FormError errorMessage={errors.email?.message} />
          )}
          {errors.email?.type === "pattern" && (
            <FormError errorMessage="유효하지 않은 이메일입니다." />
          )}
          <input
            ref={register({
              required: "필수항목입니다.",
              minLength: 5,
              maxLength: 9,
            })}
            name="password"
            placeholder="5글자이상 9글자이하의 비밀번호"
            type="password"
            className="input"
            required
          />
          {errors.password?.type === "minLength" && (
            <FormError errorMessage="5글자이상 입력하세요" />
          )}
          {errors.password?.type === "maxLength" && (
            <FormError errorMessage="9글자이하로 입력하세요" />
          )}
          <select
            ref={register({
              required: true,
            })}
            name="role"
            className="input"
          >
            {Object.keys(UserRole).map((role, idx) => (
              <option key={`${role}-${idx}`}>{role}</option>
            ))}
          </select>
          <Button
            canClick={formState.isValid}
            loading={loading}
            actionText="Create an Account"
          />
          {createAccountMutationResult?.createAccount.error && (
            <FormError
              errorMessage={createAccountMutationResult.createAccount.error}
            />
          )}
        </form>
        <div>
          {`Have an Account?    `}
          <Link to="/" className="link">
            Log in now
          </Link>
        </div>
      </div>
    </div>
  );
};

export default CreateAccount;
