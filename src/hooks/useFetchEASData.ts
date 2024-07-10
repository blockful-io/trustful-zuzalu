/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from "react";

import axios from "axios";

const useFetchEASData = (query: any, variables: any) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [data, setData] = useState(null);

  const headers = {
    "Content-Type": "application/json",
  };

  useEffect(() => {
    if (loading) {
      return;
    }

    const fetchData = async () => {
      try {
        setLoading(true);
        setError(false);
        const result = await axios.post(
          "https://optimism.easscan.org/graphql",
          {
            query,
            variables,
            headers,
          },
        );
        setData(result.data);
      } catch (err) {
        setError(err as boolean);
        setLoading(false);
      }
    };

    fetchData();
  }, [query, variables, loading]);

  return { loading, error, data };
};

export default useFetchEASData;

//Example of usage:

// const MyComponent = {
//     const QUERY = `
//       query GettingData($someVariable: String!) {
//         someFieldFromEAS_Schema(variable: $someVariable) {
//           id
//           name
//         }
//       }
//     `;
//     const VARIABLES = { someVariable: "exampleValue" };
//     const { result } = useEthereumAttestationService(QUERY, VARIABLES);
//     };
