/* eslint-disable react-hooks/exhaustive-deps */
import { useContext, useState, useEffect, type FormEvent } from "react";

import { BellIcon, ChatIcon, CheckCircleIcon } from "@chakra-ui/icons";
import {
  Box,
  Card,
  CardHeader,
  Text,
  Flex,
  Divider,
  Collapse,
  ListItem,
  UnorderedList,
  CardBody,
  useToast,
  Icon,
} from "@chakra-ui/react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { BeatLoader } from "react-spinners";
import { isAddress } from "viem";
import { optimism } from "viem/chains";
import { useAccount, useSwitchChain } from "wagmi";

import {
  CircleQuestion,
  TheFooterNavbar,
  TheHeader,
  TicketIcon,
} from "@/components/01-atoms";
import { useNotify } from "@/hooks/useNotify";
import { SESSIONS_SERVER_ENDPOINT } from "@/lib/client/constants";
import { WalletContext } from "@/lib/context/WalletContext";

const axiosClient = axios.create({
  baseURL: SESSIONS_SERVER_ENDPOINT,
});

export const CheckinSection = () => {
  const { address, chainId } = useAccount();
  const toast = useToast();
  const { switchChain } = useSwitchChain();

  const [isTrustfulVisible, setIsTrustfulVisible] = useState(false);
  const [isZuVillageVisible, setIsZuVillageVisible] = useState(false);
  const [isToDoNowVisible, setToDoNowVisible] = useState(false);
  const [isCheckoutForVisible, setIsCheckoutForVisible] = useState(false);
  const [isAboutPrivacyVisible, setIsAboutPrivacyVisible] = useState(false);
  const [isBadgeVisible, setIsBadgeVisible] = useState(false);
  const [isLoadingSessionJoining, setIsLoadingSessionJoining] = useState(false);
  const [isLoadingSessionWrapping, setIsLoadingSessionWrapping] =
    useState(false);
  const [isLoadingSessionCreation, setIsLoadingSessionCreation] =
    useState(false);
  const [sessionCreationError, setSessionCreationError] = useState<any>();
  const [sessionJoiningError, setSessionJoiningError] = useState<any>();
  const [sessionWrappingError, setSessionWrappingError] = useState<any>();
  const [sessionToWrap, setSessionToWrap] = useState<any>();
  const { notifyError } = useNotify();
  const { push } = useRouter();

  const { villagerAttestationCount } = useContext(WalletContext);

  useEffect(() => {
    if (villagerAttestationCount) {
      notifyError({
        title: "You have already checked in",
        message: "Redirecting to your badges.",
      });
      push("/my-badges");
    }
  }, [villagerAttestationCount]);

  const fetchSession = async (sessionId: string) => {
    return axiosClient
      .get(`/event?id=${sessionId}`)
      .then((res) => {
        // session exists
        return res.data;
      })
      .catch((err) => {
        setSessionJoiningError(err);
        // session does not exist
        return false;
      });
  };

  const wrapSession = async () => {
    if (!address) {
      notifyError({
        title: "No account connected",
        message: "Please connect your wallet.",
      });
      return;
    }

    if (chainId !== optimism.id) {
      notifyError({
        title: "Unsupported network",
        message:
          "Please switch to the Optmism network to use this application.",
      });
      switchChain({ chainId: optimism.id });
      return;
    }

    // const attestations = sessionToWrap.accounts.map(
    //   (acc: string): AttestationRequestData => {
    //     return {
    //       recipient: isAddress(acc)
    //         ? (acc as `0x${string}`)
    //         : "0x0000000000000000000000000000000000000000000000000000000000000000",
    //       expirationTime: BigInt(0),
    //       revocable: false,
    //       refUID:
    //         "0x0000000000000000000000000000000000000000000000000000000000000000",
    //       data: "",
    //       value: BigInt(0),
    //     };
    //   },
    // );

    // DO MULTI ATTESTATION WITH submitAttests()
  };

  const populateSession = async (sessionId: number) => {
    return axiosClient
      .post(`/populateEvent`, {
        id: sessionId,
        accounts: [address],
      })
      .then((res) => {
        return res.data;
      })
      .catch((err) => {
        setSessionJoiningError(err);
      });
  };

  const createSession = async (
    sessionHost: `0x${string}`,
    sessionName: string,
  ) => {
    axiosClient
      .post("/createEvent", {
        host: sessionHost,
        description: sessionName,
      })
      .then((res) => {
        console.log(res);
      })
      .catch((err) => {
        setSessionCreationError(err);
      });
  };

  return (
    <Flex flexDirection="column" minHeight="100vh" marginBottom="60px">
      {villagerAttestationCount !== null ? (
        <>
          <TheHeader />
          <Box
            flex={1}
            as="main"
            className="p-6 sm:px-[60px] sm:py-[80px] flex flex-col items-center"
            gap={6}
          >
            <Flex className={"items-center"} gap={2}>
              <Text className="text-center text-slate-50 text-base font-normal leading-snug">
                To start, please find a Manager to check you in.
              </Text>
            </Flex>
            <Card
              className="px-8 py-6 mt-6 relative h-max w-1/2"
              background={"#212223"}
              border={2}
              borderRadius={16}
            >
              <Flex className="absolute left-1/2 top-1 -translate-x-1/2 -translate-y-1/2 border dark:border-[#161617] border-[#707572] bg-[#F6F6F6] dark:bg-[#212322] rounded-full w-[72px] h-[72px] flex items-center justify-center">
                <TicketIcon />
              </Flex>
              <CardHeader
                gap={2}
                display={"flex"}
                alignItems={"center"}
                justifyContent={"space-between"}
                flexDirection={"column"}
                p={0}
                pt={6}
              >
                <Flex className={"items-center flex-col space-y-3"}>
                  <h1 className="text-center text-white font-semibold text-3xl">
                    Join Session
                  </h1>
                </Flex>
              </CardHeader>
              <CardBody>
                <form
                  onSubmit={async (e: FormEvent) => {
                    e.preventDefault();
                    setSessionJoiningError("");

                    const sessionId = (
                      document.getElementById(
                        "session-id-input",
                      ) as HTMLInputElement
                    ).value;

                    setIsLoadingSessionJoining(true);

                    const session = await fetchSession(sessionId);

                    if (!!session) {
                      const viewerSignedInSession = await populateSession(
                        Number(sessionId),
                      );

                      if (viewerSignedInSession) {
                        toast({
                          position: "top-right",
                          duration: 4000,
                          isClosable: true,
                          render: () => (
                            <Box
                              color="white"
                              p={4}
                              bg="green.500"
                              borderRadius="md"
                              boxShadow="lg"
                              display="flex"
                              alignItems="center"
                            >
                              <Icon as={CheckCircleIcon} w={6} h={6} mr={3} />
                              <Box>
                                <Text fontWeight="bold">
                                  Successfully joined Session.
                                </Text>
                              </Box>
                            </Box>
                          ),
                        });
                      }
                    } else {
                      setIsLoadingSessionJoining(false);
                      setSessionJoiningError("Session does not exist");
                    }

                    setIsLoadingSessionJoining(false);
                  }}
                >
                  <label htmlFor="session-id-input" className="text-white">
                    Input the Session Number, below:
                  </label>
                  <input
                    className="mt-2 rounded-md p-2.5 w-full"
                    type="number"
                    name="session-id-input"
                    id="session-id-input"
                  />
                  <input
                    type="submit"
                    value="Join Session"
                    className="my-4 p-3 rounded-md font-medium bg-[#B1EF42] w-full cursor-pointer"
                  />
                  {isLoadingSessionJoining && (
                    <span className="text-gray-400 rounded-md mt-8 w-full">
                      Loading...
                    </span>
                  )}
                  {sessionJoiningError && (
                    <span className="text-red-400 rounded-md mt-8 w-full">
                      No Session Found with this ID
                    </span>
                  )}
                </form>
              </CardBody>
            </Card>
            <Card
              className="px-8 py-6 mt-6 relative w-1/2 h-max"
              background={"#212223"}
              border={2}
              borderRadius={16}
            >
              <Flex className="absolute left-1/2 top-1 -translate-x-1/2 -translate-y-1/2 border dark:border-[#161617] border-[#707572] bg-[#F6F6F6] dark:bg-[#212322] rounded-full w-[72px] h-[72px] flex items-center justify-center">
                <ChatIcon className="text-[#B1EF42] w-6 h-6" />
              </Flex>
              <CardHeader
                gap={2}
                display={"flex"}
                alignItems={"center"}
                justifyContent={"space-between"}
                flexDirection={"column"}
                p={0}
                pt={6}
              >
                <Flex className={"items-center flex-col space-y-3"}>
                  <h1 className="text-center text-white font-semibold text-3xl">
                    Create Session
                  </h1>
                </Flex>
              </CardHeader>
              <CardBody>
                <form
                  onSubmit={async (e: FormEvent) => {
                    e.preventDefault();
                    setSessionCreationError("");
                    alert("Creating session");
                    setIsLoadingSessionCreation(true);

                    const sessionHost = (
                      document.getElementById(
                        "session-host-input",
                      ) as HTMLInputElement
                    ).value;

                    try {
                      const isAddr = isAddress(sessionHost);

                      if (!isAddr) {
                        setIsLoadingSessionCreation(false);
                        setSessionCreationError("Invalid address");
                        throw new Error("Invalid address");
                      }
                    } catch (error) {
                      setIsLoadingSessionCreation(false);
                      setSessionCreationError("Invalid address");
                      return;
                    }

                    const sessionName = (
                      document.getElementById(
                        "session-name-input",
                      ) as HTMLInputElement
                    ).value;

                    await createSession(
                      sessionHost as `0x${string}`,
                      sessionName,
                    );

                    setIsLoadingSessionCreation(false);
                  }}
                >
                  <label htmlFor="session-name-input" className="text-white">
                    Input the Session Name, below:
                  </label>
                  <input
                    className="my-2 rounded-md p-2.5 w-full"
                    type="string"
                    name="session-name-input"
                    id="session-name-input"
                  />
                  <label htmlFor="session-host-input" className="text-white">
                    Input the Session Host address, below:
                  </label>
                  <input
                    className="mt-2 rounded-md p-2.5 w-full"
                    type="string"
                    name="session-host-input"
                    id="session-host-input"
                  />
                  <input
                    type="submit"
                    value="Create Session"
                    className="my-4 p-3 rounded-md font-medium bg-[#B1EF42] w-full cursor-pointer"
                  />
                  {isLoadingSessionCreation && (
                    <span className="text-gray-400 rounded-md mt-8 w-full">
                      Loading...
                    </span>
                  )}
                  {sessionCreationError && (
                    <span className="text-red-400 rounded-md mt-8 w-full">
                      {sessionCreationError.toString()}
                    </span>
                  )}
                </form>
              </CardBody>
            </Card>
            <Card
              className="px-8 py-6 mt-6 relative w-1/2 h-max"
              background={"#212223"}
              border={2}
              borderRadius={16}
            >
              <Flex className="absolute left-1/2 top-1 -translate-x-1/2 -translate-y-1/2 border dark:border-[#161617] border-[#707572] bg-[#F6F6F6] dark:bg-[#212322] rounded-full w-[72px] h-[72px] flex items-center justify-center">
                <BellIcon className="text-[#B1EF42] w-6 h-6" />
              </Flex>
              <CardHeader
                gap={2}
                display={"flex"}
                alignItems={"center"}
                justifyContent={"space-between"}
                flexDirection={"column"}
                p={0}
                pt={6}
              >
                <Flex className={"items-center flex-col space-y-3"}>
                  <h1 className="text-center text-white font-semibold text-3xl">
                    Wrap Session
                  </h1>
                </Flex>
              </CardHeader>
              <CardBody>
                <form
                  onSubmit={async (e: FormEvent) => {
                    e.preventDefault();
                    setSessionWrappingError("");
                    setSessionToWrap(null);

                    const sessionId = (
                      document.getElementById(
                        "session-wrapping-id-input",
                      ) as HTMLInputElement
                    ).value;

                    setIsLoadingSessionWrapping(true);

                    const session = await fetchSession(sessionId);

                    if (!!session) {
                      if (session.host !== address) {
                        setIsLoadingSessionWrapping(false);
                        setSessionWrappingError(
                          "Session cannot be wrapped by connected account",
                        );
                        return;
                      } else {
                        setSessionToWrap(session);
                      }
                    } else {
                      setIsLoadingSessionWrapping(false);
                      setSessionWrappingError("Session does not exist");
                    }

                    setIsLoadingSessionWrapping(false);
                  }}
                >
                  <label
                    htmlFor="session-wrapping-id-input"
                    className="text-white"
                  >
                    Input the Session Number, below:
                  </label>
                  <input
                    className="mt-2 rounded-md p-2.5 w-full"
                    type="number"
                    name="session-wrapping-id-input"
                    id="session-wrapping-id-input"
                  />
                  <input
                    type="submit"
                    value="Wrap Session"
                    className="my-4 p-3 rounded-md font-medium bg-[#B1EF42] w-full cursor-pointer"
                  />
                  {isLoadingSessionWrapping && (
                    <span className="text-gray-400 rounded-md mt-8 w-full">
                      Loading...
                    </span>
                  )}
                  {sessionWrappingError && (
                    <span className="text-red-400 rounded-md mt-8 w-full">
                      {sessionWrappingError.toString()}
                    </span>
                  )}
                  {sessionToWrap && (
                    <div className="mt-8">
                      <h2 className="text-white text-xl font-semibold">
                        Session Details:
                      </h2>
                      <div className="text-white">
                        <div className="flex space-x-2">
                          <p>Host:</p>
                          <p>{sessionToWrap.host}</p>
                        </div>
                        <div className="flex space-x-2">
                          <p>Description:</p>
                          <p>{sessionToWrap.description}</p>
                        </div>
                      </div>
                      <div className="flex text-white">
                        <p className="mr-2">Attendees:</p>
                        <div className="flex flex-wrap space-x-3">
                          {sessionToWrap.accounts.map((account: string) => {
                            return <p key={account}>| {account} |</p>;
                          })}
                        </div>
                      </div>
                      <button
                        onClick={wrapSession}
                        className="mt-4 p-3 rounded-md font-bold bg-[#c6ea8a] w-full cursor-pointer"
                      >
                        Wrap Session and Issue Badges
                      </button>
                    </div>
                  )}
                </form>
              </CardBody>
            </Card>

            <Flex
              flexDirection={"column"}
              className="w-full h-full items-center"
            >
              <Divider className="border-slate-50 opacity-10 w-full" />
              <Flex
                className="w-full flex-row py-3 cursor-pointer"
                gap={4}
                onClick={() => setIsTrustfulVisible(!isTrustfulVisible)}
              >
                <CircleQuestion />
                <Flex flexDirection={"column"} justifyContent={"center"}>
                  <Text className="text-slate-50 text-sm font-normal leading-tight">
                    What is Trustul?
                  </Text>
                </Flex>
              </Flex>
              <Collapse in={isTrustfulVisible} animateOpacity>
                <Box p="40px" color="white" pt="20px" pb="20px">
                  Trustful is a reputation aggregator system designed to match
                  governance, participation, and efforts. Using the Ethereum
                  Attestation Service (EAS) and a badge system. We can attest to
                  specific participations and ensure that this information
                  on-chain results in a scoring system. This system can be used
                  for resource allocation, governance etc.
                </Box>
              </Collapse>
              <Divider className="border-slate-50 opacity-10 w-full" />
              <Flex
                className="w-full flex-row py-3 cursor-pointer"
                gap={4}
                onClick={() => setIsZuVillageVisible(!isZuVillageVisible)}
              >
                <CircleQuestion />
                <Flex flexDirection={"column"} justifyContent={"center"}>
                  <Text className="text-slate-50 text-sm font-normal leading-tight">
                    How does it work in ZuVillage?
                  </Text>
                </Flex>
              </Flex>
              <Collapse in={isZuVillageVisible} animateOpacity>
                <Box p="40px" color="white" pt="20px" pb="20px">
                  In ZuVillage, your interactions and contributions will be
                  attested and stored on-chain. This promotes dialogue, avoids
                  echo chambers, and encourages participation. In the future,
                  this aggregated reputation can be used to benefit
                  participants, providing them with recognition.
                </Box>
              </Collapse>
              <Divider className="border-slate-50 opacity-10 w-full" />

              <Flex
                className="w-full flex-row py-3 cursor-pointer"
                gap={4}
                onClick={() => setIsBadgeVisible(!isBadgeVisible)}
              >
                <CircleQuestion />
                <Flex flexDirection={"column"} justifyContent={"center"}>
                  <Text className="text-slate-50 text-sm font-normal leading-tight">
                    What is a badge?
                  </Text>
                </Flex>
              </Flex>
              <Collapse in={isBadgeVisible} animateOpacity>
                <Box p="40px" color="white" pt="20px" pb="20px">
                  The badges are created with EAS and managed by Trustful, it
                  aggregates reputation based on interactions and contributions
                  during ZuVillage Georgia. It allows members to give and
                  receive badges recognizing their contributions and knowledge,
                  fostering real connections and deep dialogues, therefore
                  helping to build reputation scores.
                </Box>
              </Collapse>
              <Divider className="border-slate-50 opacity-10 w-full" />
              <Flex
                className="w-full flex-row py-3 cursor-pointer"
                gap={4}
                onClick={() => setIsCheckoutForVisible(!isCheckoutForVisible)}
              >
                <CircleQuestion />
                <Flex flexDirection={"column"} justifyContent={"center"}>
                  <Text className="text-slate-50 text-sm font-normal leading-tight">
                    What is the check-out for?
                  </Text>
                </Flex>
              </Flex>
              <Collapse in={isCheckoutForVisible} animateOpacity>
                <Box p="40px" color="white" pt="20px" pb="20px">
                  The check-out badge confirms that you are ending your stay at
                  ZuVillage Georgia. It will be used to calculate how long you
                  lived in our ZuVillage, which will aggregate to your
                  ZuVillager reputation score. It will also help us keep track
                  of how many people are currently present.
                </Box>
              </Collapse>
              <Divider className="border-slate-50 opacity-10 w-full" />

              <Flex
                className="w-full flex-row py-3 cursor-pointer"
                gap={4}
                onClick={() => setToDoNowVisible(!isToDoNowVisible)}
              >
                <CircleQuestion />
                <Flex flexDirection={"column"} justifyContent={"center"}>
                  <Text className="text-slate-50 text-sm font-normal leading-tight">
                    What to do now?
                  </Text>
                </Flex>
              </Flex>
              <Collapse in={isToDoNowVisible} animateOpacity>
                <Box p="40px" color="white" pt="20px" pb="20px">
                  Now that you have connected your wallet, you need to do the
                  check-in.
                  <UnorderedList styleType="disc" pl={4}>
                    {" "}
                    <ListItem>
                      {" "}
                      Your check-in badge will be your first badge, unlocking
                      the creation of other badges.
                    </ListItem>
                    <ListItem>
                      {" "}
                      By engaging with the event—whether you agree or disagree
                      with someone, participate in talks, or create sessions—you
                      can earn badges or respond to them.
                    </ListItem>
                    <ListItem>
                      {" "}
                      This process builds your reputation, ties to your address
                      and based on your interactions shapes your reputation
                      score.
                    </ListItem>
                  </UnorderedList>
                </Box>
              </Collapse>

              <Divider className="border-slate-50 opacity-10 w-full" />
              <Flex
                className="w-full flex-row py-3 cursor-pointer"
                gap={4}
                onClick={() => setIsAboutPrivacyVisible(!isAboutPrivacyVisible)}
              >
                <CircleQuestion />
                <Flex flexDirection={"column"} justifyContent={"center"}>
                  <Text className="text-slate-50 text-sm font-normal leading-tight">
                    About privacy
                  </Text>
                </Flex>
              </Flex>
              <Collapse in={isAboutPrivacyVisible} animateOpacity>
                <Box p="40px" color="white" pt="20px" pb="20px">
                  Trustful uses EAS to issue on-chain badges. Choose your wallet
                  carefully and issue badges and comments, keeping blockchain
                  permanence in mind. We are working to enhance it soon and keep
                  the privacy-first core in our roadmap.
                </Box>
              </Collapse>
            </Flex>
          </Box>
          <TheFooterNavbar />
        </>
      ) : (
        <Box flex={1} className="flex justify-center items-center">
          <BeatLoader size={8} color="#B1EF42" />
        </Box>
      )}
    </Flex>
  );
};
