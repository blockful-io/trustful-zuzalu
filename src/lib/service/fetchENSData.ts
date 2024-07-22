/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from "axios";

export async function fetchENSData(query: any, variables: any) {
  const ENS_SUBGRAPH_URL = process.env.GRAPHQL_ENS_API_KEY;
  try {
    const headers = {
      "Content-Type": "application/json",
    };
    const response = await axios.post(
      "https://gateway-arbitrum.network.thegraph.com/api/" +
        ENS_SUBGRAPH_URL +
        "/subgraphs/id/5XqPmWe6gjyrJtFn9cLy237i4cWw2j9HcUJEXsP5qGtH",
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
