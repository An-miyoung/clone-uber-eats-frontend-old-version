import React from "react";
import { useForm } from "react-hook-form";
import FormError from "../components/form-error";
import { gql, useMutation } from "@apollo/client";
import { Helmet } from "react-helmet-async";
import {
  loginMutation,
  loginMutationVariables,
} from "../__generated__/loginMutation";
import Button from "../components/button";
import { Link } from "react-router-dom";
import { authToken, isLoggedInVar } from "../apollo";
import { LOCALSTORAGE_TOKEN } from "../constants";
import NuberLogo from "../components/nuberLogo";

const LOGIN_MUTATION = gql`
  mutation loginMutation($loginInput: LoginInput!) {
    login(input: $loginInput) {
      ok
      error
      token
    }
  }
`;

interface ILoginForm {
  email: string;
  password: string;
}

const Login = () => {
  const { register, errors, getValues, handleSubmit, formState } =
    useForm<ILoginForm>({
      mode: "onBlur",
    });

  const onCompleted = (data: loginMutation) => {
    const {
      login: { ok, token },
    } = data;
    if (ok && token !== null) {
      localStorage.setItem(LOCALSTORAGE_TOKEN, token);
      authToken(token);
      isLoggedInVar(true);
    }
  };

  const [loginMutation, { data: loginMutationResult, loading }] = useMutation<
    loginMutation,
    loginMutationVariables
  >(LOGIN_MUTATION, {
    onCompleted,
  });

  const onSubmit = () => {
    if (!loading) {
      const { email, password } = getValues();
      loginMutation({
        variables: {
          loginInput: {
            email,
            password,
          },
        },
      });
    }
  };

  return (
    <div className="h-screen flex items-center flex-col mt-10 lg:mt-28">
      <Helmet>
        <title>Login | Nuber Eats</title>
      </Helmet>
      <div className="w-full max-w-screen-sm flex flex-col px-5 items-center">
        <div className="w-52 mb-10">
          <NuberLogo />
        </div>
        <h4 className=" w-full font-medium text-left text-3xl mb-5 mx-5">
          Welcome back
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
            data-testid="email-input"
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
          <Button
            canClick={formState.isValid}
            loading={loading}
            actionText="Log in"
          />
          {loginMutationResult?.login.error && (
            <FormError errorMessage={loginMutationResult.login.error} />
          )}
        </form>
        <div>
          {`New to Nuber?    `}
          <Link to="/create-account" className="link">
            Create an Account
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
