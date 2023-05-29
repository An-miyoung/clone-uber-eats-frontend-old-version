import { gql, useQuery } from "@apollo/client";
import { meQuery } from "../__generated__/meQuery";

const ME_QUERY = gql`
  query meQuery {
    me {
      id
      email
      role
      verified
    }
  }
`;

const useMe = () => {
  const { data, loading, error } = useQuery<meQuery>(ME_QUERY);
  return { data, loading, error };
};

export default useMe;
