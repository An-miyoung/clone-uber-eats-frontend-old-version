import { gql, useMutation } from "@apollo/client";
import React, { useState } from "react";
import { Helmet } from "react-helmet-async";
import { useForm } from "react-hook-form";
import { useHistory, useParams } from "react-router-dom";
import Button from "../../components/button";
import FormError from "../../components/form-error";
import { MY_RESTAURANT_QUERY } from "./my-restaurant";
import {
  createDish,
  createDishVariables,
} from "../../__generated__/createDish";

interface IFormProps {
  name: string;
  price: string;
  description: string;
  [key: string]: string;
}

const CREATE_DISH_MUTATION = gql`
  mutation createDish($input: CreateDishInput!) {
    createDish(input: $input) {
      ok
      error
    }
  }
`;

const AddDish = () => {
  // interface 를 선언하지 않고 아래와 같이 선언할 수 있다.
  const { id: restaurantId } = useParams<{ id: string }>();
  const history = useHistory();
  const [optionNumber, setOptionNumber] = useState<number[]>([]);

  const { register, getValues, setValue, handleSubmit, formState, errors } =
    useForm<IFormProps>({
      mode: "onChange",
    });

  const [creteDishMutation, { loading, data: creteDishMutationesult }] =
    useMutation<createDish, createDishVariables>(CREATE_DISH_MUTATION, {
      refetchQueries: [
        {
          query: MY_RESTAURANT_QUERY,
          variables: {
            input: {
              id: +restaurantId,
            },
          },
        },
      ],
    });

  const onOptionClick = () => {
    setOptionNumber((prev) => [...prev, Date.now()]);
  };
  const deleteOption = (idToDelete: number) => {
    setOptionNumber((prev) => prev.filter((id) => id !== idToDelete));
    setValue(`${idToDelete}-OptionName`, "");
    setValue(`${idToDelete}-OptionExtra`, "");
  };

  const onSubmit = () => {
    const { name, price, description, ...rest } = getValues();

    const optionsObject = optionNumber.map((theId) => ({
      name: rest[`${theId}-OptionName`],
      extra: +rest[`${theId}-OptionExtra`],
    }));

    creteDishMutation({
      variables: {
        input: {
          restaurantId: +restaurantId,
          name,
          price: +price,
          description,
          options: optionsObject,
        },
      },
    });
    history.goBack();
  };

  return (
    <div className="h-screen flex items-center flex-col mt-10 lg:mt-28">
      <Helmet>
        <title>Add Menu | Nuber Eats</title>
      </Helmet>
      <div className=" grid max-w-screen-sm gap-3 mt-5 w-full mb-5">
        <h4 className=" w-full font-medium text-left text-3xl mx-5">
          메뉴 추가하기
        </h4>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className=" grid gap-3 mt-5 mb-5 w-full"
        >
          <input
            ref={register({
              required: "메뉴이름은 필수항목입니다.",
            })}
            name="name"
            placeholder="메뉴이름"
            type="text"
            className="input"
            required
          />
          {errors.name?.message && (
            <FormError errorMessage={errors.name?.message} />
          )}
          <input
            ref={register({
              required: "메뉴가격은 필수항목입니다.",
              min: 0,
            })}
            name="price"
            placeholder="메뉴금액만 0이상의 숫자로 넣어주세요"
            type="number"
            min={0}
            className="input"
            required
          />
          {errors.price?.message && (
            <FormError errorMessage={errors.price.message} />
          )}
          {errors.price?.type === "min" && (
            <FormError errorMessage="0이상의 양수를 입력해 주세요" />
          )}
          <input
            ref={register({
              required: "메뉴설명은 필수항목입니다.",
            })}
            name="description"
            placeholder="메뉴에 대한 설명을 입력해 주세요."
            type="text"
            className="input"
            required
          />
          {errors.description?.message && (
            <FormError errorMessage={errors.description.message} />
          )}
          <div className="my-4">
            <h4 className="font-medium  mb-3 text-lg">메뉴 옵션 설정</h4>
            <span
              onClick={onOptionClick}
              className="cursor-pointer text-white font-light bg-gray-800 py-1 px-2 mt-5"
            >
              옵션 만들기
            </span>
            {optionNumber.length !== 0 &&
              optionNumber.map((id) => (
                <div key={id} className="mt-3 mb-3">
                  <input
                    ref={register}
                    name={`${id}-OptionName`}
                    type="text"
                    placeholder="옵션이름(ex. 맵기정도)"
                    className="focus:outline-none focus:border-gray-400 p-2 mr-3 border-2 text-sm border-gray-300"
                  />
                  <input
                    ref={register}
                    name={`${id}-OptionExtra`}
                    min={0}
                    type="number"
                    placeholder="가격추가(0이상 숫자만)"
                    className="focus:outline-none focus:border-gray-400 p-2 mr-3 border-2 text-sm border-gray-300"
                  />
                  <span
                    onClick={() => deleteOption(id)}
                    className="cursor-pointer text-white font-light bg-red-500 px-4 py-2.5 text-sm"
                  >
                    삭제
                  </span>
                </div>
              ))}
          </div>

          <Button
            canClick={formState.isValid}
            loading={loading}
            actionText="새로운 메뉴 생성"
          />
          {creteDishMutationesult?.createDish.error && (
            <FormError errorMessage={creteDishMutationesult.createDish.error} />
          )}
        </form>
      </div>
    </div>
  );
};

export default AddDish;
