import { gql, useMutation } from "@apollo/client";
import React, { useState } from "react";
import { Helmet } from "react-helmet-async";
import {
  createRestaurant,
  createRestaurantVariables,
} from "../../__generated__/createRestaurant";
import { useForm } from "react-hook-form";
import Button from "../../components/button";
import FormError from "../../components/form-error";

interface IFormProps {
  name: string;
  address: string;
  categoryName: string;
  file: FileList;
}

const CREATE_RESTAURANT_MUTATION = gql`
  mutation createRestaurant($input: CreateRestaurantInput!) {
    createRestaurant(input: $input) {
      ok
      error
    }
  }
`;

const AddRestaurants = () => {
  const [uploading, setUploading] = useState(false);
  const { register, getValues, formState, errors, handleSubmit } =
    useForm<IFormProps>({
      mode: "onBlur",
    });

  const onCompleted = (data: createRestaurant) => {
    const {
      createRestaurant: { ok },
    } = data;
    if (ok) {
      setUploading(false);
    }
  };
  const [createRestaurantMutation, { data }] = useMutation<
    createRestaurant,
    createRestaurantVariables
  >(CREATE_RESTAURANT_MUTATION, {
    onCompleted,
  });

  const onSubmit = async () => {
    try {
      setUploading(true);
      const { name, address, categoryName, file } = getValues();
      const actualFile = file[0];
      const formBody = new FormData();
      formBody.append("file", actualFile);
      const { url: coverImg } = await (
        await fetch("http://localhost:4000/uploads", {
          method: "POST",
          body: formBody,
        })
      ).json();

      createRestaurantMutation({
        variables: {
          input: {
            name,
            address,
            categoryName,
            coverImg,
          },
        },
      });
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="h-screen flex items-center flex-col mt-10 lg:mt-28">
      <Helmet>
        <title>Add Restaurant | Nuber Eats</title>
      </Helmet>
      <h2>새로운 레스토랑 만들기</h2>
      <div>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className=" grid gap-3 mt-5 mb-5 w-full"
        >
          <input
            ref={register({
              required: "이름은 필수입력입니다.",
            })}
            name="name"
            type="text"
            placeholder="식당이름"
            className="input"
            required
          />
          {errors.name?.message && (
            <FormError errorMessage={errors.name?.message} />
          )}
          <input
            ref={register({
              required: "주소는 필수입력입니다.",
            })}
            name="address"
            type="text"
            placeholder="식당주소"
            className="input"
            required
          />
          {errors.address?.message && (
            <FormError errorMessage={errors.address?.message} />
          )}
          <input
            ref={register({
              required: "카테고리는 필수입력입니다.",
            })}
            name="categoryName"
            type="text"
            placeholder="카테고리"
            className="input"
          />
          {errors.categoryName?.message && (
            <FormError errorMessage={errors.categoryName?.message} />
          )}
          <div>
            <input
              ref={register({
                required: true,
              })}
              name="file"
              type="file"
              accept="image/"
              className="input"
              required
            />
          </div>
          {errors.file?.message && (
            <FormError errorMessage={errors.file?.message} />
          )}
          <Button
            canClick={formState.isValid}
            loading={uploading}
            actionText="레스토랑 생성"
          />
          {data?.createRestaurant?.error && (
            <FormError errorMessage={data.createRestaurant.error} />
          )}
        </form>
      </div>
    </div>
  );
};

export default AddRestaurants;
