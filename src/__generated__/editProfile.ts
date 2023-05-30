/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { EditProfileInput } from "./globalTypes";

// ====================================================
// GraphQL mutation operation: editProfile
// ====================================================

export interface editProfile_editProfile_user {
  __typename: "User";
  id: number;
  email: string;
  password: string;
}

export interface editProfile_editProfile {
  __typename: "EditProfileOutput";
  ok: boolean;
  error: string | null;
  user: editProfile_editProfile_user | null;
}

export interface editProfile {
  editProfile: editProfile_editProfile;
}

export interface editProfileVariables {
  input: EditProfileInput;
}
