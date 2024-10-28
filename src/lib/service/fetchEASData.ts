/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from "axios";

export async function fetchEASData(query: any, variables: any) {
  try {
    const headers = {
      "Content-Type": "application/json",
    };
    const response = await axios.post(
      "https://scroll.easscan.org/graphql",
      {
        query,
        variables,
      },
      { headers },
    );
    return { response: response, success: true };
  } catch (err) {
    return { response: null, success: false };
  }
}

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
