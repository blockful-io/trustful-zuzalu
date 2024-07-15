import { useEffect, useState, type ChangeEvent } from "react";

import { CheckCircleIcon, CheckIcon } from "@chakra-ui/icons";
import {
  Card,
  Text,
  Select,
  Flex,
  Button,
  Textarea,
  Box,
  Icon,
  Link,
} from "@chakra-ui/react";
import { useToast } from "@chakra-ui/react";
import { BeatLoader } from "react-spinners";
import { isAddress } from "viem";
import { useAccount } from "wagmi";

import { InputAddressUser } from "@/components/02-molecules/";
import { useNotify } from "@/hooks";
import { ROLES, ZUVILLAGE_SCHEMAS } from "@/lib/client/constants";
import { ID_CHECK_IN_QUERY } from "@/lib/client/schemaQueries";
import { fetchEASData, hasRole } from "@/lib/service";
import { grantRole } from "@/lib/service/grantRole";
import { revoke } from "@/lib/service/revoke";
import { revokeRole } from "@/lib/service/revokeRole";
import { setAttestationTitle } from "@/lib/service/setAttestationTitle";
import { setSchema } from "@/lib/service/setSchema";
import { EthereumAddress } from "@/lib/shared/types";
import { getEllipsedAddress } from "@/utils/formatters";
import {
  ACTIONS_OPTIONS,
  ADMIN_ACTION,
  ADMIN_OPTIONS,
  ROLES_OPTIONS,
} from "@/utils/ui-utils";

export const DropdownMenuAdmin = () => {
  const { address } = useAccount();
  const { notifyError } = useNotify();
  const toast = useToast();

  const [adminAction, setAdminAction] = useState<ADMIN_ACTION | null>(null);
  const [role, setRole] = useState<ROLES | null>(null);
  const [inputAddress, setInputAddress] = useState<string>("");
  const [validAddress, setValidAddress] = useState<EthereumAddress | null>(
    null,
  );
  const [isloading, setIsLoading] = useState<boolean>(false);
  const [attestationTitleText, setAttestationTitleText] = useState<string>("");
  const [attestationBadgeIsValid, setAttestationBadgeIsValid] =
    useState<boolean>(false);
  const [schemaUID, setSchemaUID] = useState<string | `0x${string}`>("");
  const [action, setAction] = useState<number>(0);

  // Updates the validAddress when the inputAddress changes
  useEffect(() => {
    if (inputAddress && isAddress(inputAddress)) {
      setValidAddress(new EthereumAddress(inputAddress));
    }
  }, [inputAddress]);

  // Handle the input change and validate the address
  const handleInputChange = (value: string) => {
    setInputAddress(value);
  };

  useEffect(() => {
    setRole(null);
  }, [adminAction]);

  // Get the current action selected and move to state
  const handleActionSelectChange = (event: ChangeEvent<HTMLSelectElement>) => {
    ADMIN_OPTIONS.filter((admin) => {
      if (admin.action === event.target.value) {
        setAdminAction(admin.action);
      } else {
        console.log("Selected action does not exist");
      }
    });
  };

  // Get the current role selected and move to state
  const handleRoleSelectChange = (
    event: ChangeEvent<HTMLSelectElement>,
  ): void => {
    const selectedRoleValue = event.target.value;
    const rolesValues = Object.values(ROLES_OPTIONS);
    const selectedRole = rolesValues.find((role) => role === selectedRoleValue);

    if (selectedRole) {
      setRole(selectedRole);
    } else {
      console.log("Selected role does not exist in ROLES_OPTIONS");
    }
  };

  // Call the grantRole function with the current state values
  const handleGrantRole = async () => {
    if (address && inputAddress && role && validAddress) {
      const response = await grantRole({
        from: address,
        role: role,
        account: validAddress.address as `0x${string}`,
        msgValue: BigInt(0),
      });
      if (response instanceof Error) {
        setIsLoading(false);
        notifyError({
          title: "Transaction Rejected",
          message: response.message,
        });
        return;
      }

      if (response.status !== "success") {
        setIsLoading(false);
        notifyError({
          title: "Transaction Rejected",
          message: "Contract execution reverted.",
        });
        return;
      }

      // TODO: Move this function to only one place
      // TODO: Move to useNotify to create a notifySuccessWithLink function
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
              <Text fontWeight="bold">Success.</Text>
              <Text>
                Badge sent at tx:{" "}
                <Link
                  href={`https://optimistic.etherscan.io/tx/${response.transactionHash}`}
                  isExternal
                  color="white"
                  textDecoration="underline"
                >
                  {getEllipsedAddress(response.transactionHash)}
                </Link>
              </Text>
            </Box>
          </Box>
        ),
      });
      response ? setIsLoading(true) : setIsLoading(false);
    }
    setIsLoading(false);
  };

  // Call the revokeRole function with the current state values
  const handleRevokeGrantRole = async () => {
    if (address && inputAddress && role && validAddress) {
      const userHasRole = await hasRole(
        role,
        validAddress.address as `0x${string}`,
      );
      if (userHasRole) {
        const response = await revokeRole({
          from: address,
          role: role,
          account: validAddress.address as `0x${string}`,
          msgValue: BigInt(0),
        });
        if (response instanceof Error) {
          setIsLoading(false);
          notifyError({
            title: "Transaction Rejected",
            message: response.message,
          });
          return;
        }

        if (response.status !== "success") {
          setIsLoading(false);
          notifyError({
            title: "Transaction Rejected",
            message: "Contract execution reverted.",
          });
          return;
        }

        // TODO: Move to useNotify to create a notifySuccessWithLink function
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
                <Text fontWeight="bold">Success.</Text>
                <Text>
                  Badge sent at tx:{" "}
                  <Link
                    href={`https://optimistic.etherscan.io/tx/${response.transactionHash}`}
                    isExternal
                    color="white"
                    textDecoration="underline"
                  >
                    {getEllipsedAddress(response.transactionHash)}
                  </Link>
                </Text>
              </Box>
            </Box>
          ),
        });
        response ? setIsLoading(true) : setIsLoading(false);
      } else if (!userHasRole) {
        setIsLoading(false);
        notifyError({
          title: `Address doesn't have the role`,
          message: "Address doesn't have this badge.",
        });
        return;
      }
    }
    setIsLoading(false);
  };

  // Get the current title and move to state. It also updates the textarea height based on the content
  const handleTextareaChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    const textareaLineHeight = 22;
    const scrollHeight = event.target.scrollHeight - 16;

    const currentRows = Math.ceil(scrollHeight / textareaLineHeight);
    if (currentRows >= 2) {
      event.target.rows = currentRows;
    }
    setAttestationTitleText(event.target.value);
  };

  const handleAttestationTitle = async () => {
    if (address) {
      const response = await setAttestationTitle({
        from: address,
        isValid: attestationBadgeIsValid,
        title: attestationTitleText,
        value: BigInt(0),
      });
      if (response instanceof Error) {
        setIsLoading(false);
        notifyError({
          title: "Transaction Rejected",
          message: response.message,
        });
        return;
      }

      if (response.status !== "success") {
        setIsLoading(false);
        notifyError({
          title: "Transaction Rejected",
          message: "Contract execution reverted.",
        });
        return;
      }

      // TODO: Move to useNotify to create a notifySuccessWithLink function
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
              <Text fontWeight="bold">Success.</Text>
              <Text>
                Badge sent at tx:{" "}
                <Link
                  href={`https://optimistic.etherscan.io/tx/${response.transactionHash}`}
                  isExternal
                  color="white"
                  textDecoration="underline"
                >
                  {getEllipsedAddress(response.transactionHash)}
                </Link>
              </Text>
            </Box>
          </Box>
        ),
      });
      response ? setIsLoading(true) : setIsLoading(false);
    }
    setIsLoading(false);
  };

  const handleAttestationValidBadge = (
    event: ChangeEvent<HTMLSelectElement>,
  ): void => {
    const selectedRoleValue = event.target.value;

    if (selectedRoleValue === "Yes") {
      setAttestationBadgeIsValid(true);
    } else if (selectedRoleValue === "No") {
      setAttestationBadgeIsValid(false);
    } else {
      console.log("Selected Badge Is Valid does not exist in options");
    }
  };

  // SCHEMA

  // Get the current title and move to state. It also updates the textarea height based on the content
  const handleTextareaSchemaUIDChange = (
    event: ChangeEvent<HTMLTextAreaElement>,
  ) => {
    setSchemaUID(event.target.value);
  };

  // Get the current role selected and move to state
  const handleAction = (event: ChangeEvent<HTMLSelectElement>): void => {
    const actionSchemaValue = event.target.value;
    setAction(Number(actionSchemaValue));
  };

  const handleSetSchema = async () => {
    if (address) {
      const response = await setSchema({
        from: address,
        uid: schemaUID as `0x${string}`,
        action: action,
        msgValue: BigInt(0),
      });

      if (response instanceof Error) {
        setIsLoading(false);
        notifyError({
          title: "Transaction Rejected",
          message: response.message,
        });
        return;
      }

      if (response.status !== "success") {
        setIsLoading(false);
        notifyError({
          title: "Transaction Rejected",
          message: "Contract execution reverted.",
        });
        return;
      }

      // TODO: Move to useNotify to create a notifySuccessWithLink function
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
              <Text fontWeight="bold">Success.</Text>
              <Text>
                Badge sent at tx:{" "}
                <Link
                  href={`https://optimistic.etherscan.io/tx/${response.transactionHash}`}
                  isExternal
                  color="white"
                  textDecoration="underline"
                >
                  {getEllipsedAddress(response.transactionHash)}
                </Link>
              </Text>
            </Box>
          </Box>
        ),
      });
      response ? setIsLoading(true) : setIsLoading(false);
    }
    setIsLoading(false);
  };

  const handleQuery = async () => {
    const queryVariables = {
      where: {
        schemaId: {
          equals: ZUVILLAGE_SCHEMAS.ATTEST_MANAGER.uid,
        },
        recipient: {
          equals: inputAddress,
        },
        decodedDataJson: {
          contains: "Manager",
        },
      },
    };

    const { response, success } = await fetchEASData(
      ID_CHECK_IN_QUERY,
      queryVariables,
    );

    if (!success || !response) {
      notifyError({
        title: "Cannot fetch EAS",
        message: "Error while fetching Attestation data from Subgraphs",
      });
      return;
    }

    if (response.data.data.attestations.length === 0) {
      notifyError({
        title: "Cannot fetch Badge",
        message: "This user doesn't not have a Manager badge.",
      });
      return;
    }

    if (response.data.data.attestations[0].revoked) {
      notifyError({
        title: "Already Revoked",
        message: "This badge was revoked",
      });
      return;
    }

    const txuid = response.data.data.attestations[0].id;
    const transactionResponse = await revoke(
      address as `0x${string}`,
      ZUVILLAGE_SCHEMAS.ATTEST_MANAGER.uid,
      txuid as `0x${string}`,
      0n,
    );

    if (transactionResponse instanceof Error) {
      setIsLoading(false);
      notifyError({
        title: "Transaction Rejected",
        message: transactionResponse.message,
      });
      return;
    }

    if (transactionResponse.status !== "success") {
      setIsLoading(false);
      notifyError({
        title: "Transaction Rejected",
        message: "Contract execution reverted.",
      });
      return;
    }

    // TODO: Move to useNotify to create a notifySuccessWithLink function
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
            <Text fontWeight="bold">Success.</Text>
            <Text>
              Badge sent at tx:{" "}
              <Link
                href={`https://optimistic.etherscan.io/tx/${transactionResponse.transactionHash}`}
                isExternal
                color="white"
                textDecoration="underline"
              >
                {getEllipsedAddress(transactionResponse.transactionHash)}
              </Link>
            </Text>
          </Box>
        </Box>
      ),
    });
  };

  const handleRevokeManagerRole = async () => {
    await handleQuery();
    setIsLoading(false);
  };

  const renderAdminAction: Record<ADMIN_ACTION, React.JSX.Element> = {
    [ADMIN_ACTION.GRANT_ROLE]: (
      <Flex className="w-full flex-col">
        <Flex className="gap-4 pb-4 justify-start items-center">
          <Select
            placeholder="Role"
            className="flex text-slate-50 opacity-70 text-sm font-normal leading-tight"
            color="white"
            onChange={handleRoleSelectChange}
          >
            {Object.entries(ROLES_OPTIONS).map(
              ([roleName, roleValue], index) => (
                <option key={index} value={roleValue}>
                  {roleName}
                </option>
              ),
            )}
          </Select>
        </Flex>
        <InputAddressUser
          label="Address to Grant"
          onInputChange={handleInputChange}
          inputAddress={String(inputAddress)}
        />
        <Button
          className="w-full justify-center items-center gap-2 px-6 bg-[#B1EF42] text-[#161617] rounded-lg"
          _hover={{ bg: "#B1EF42" }}
          _active={{ bg: "#B1EF42" }}
          isLoading={isloading}
          isDisabled={!isAddress(inputAddress.toString()) || !role}
          spinner={<BeatLoader size={8} color="white" />}
          onClick={() => {
            setIsLoading(true);
            handleGrantRole();
          }}
        >
          <CheckIcon className="w-[16px] h-[16px]" />
          Confirm
        </Button>
      </Flex>
    ),
    [ADMIN_ACTION.REVOKE_ROLE]: (
      <Flex className="w-full flex-col">
        <Flex className="gap-4 pb-4 justify-start items-center">
          <Select
            placeholder="Role"
            className="flex text-slate-50 opacity-70 text-sm font-normal leading-tight"
            color="white"
            onChange={handleRoleSelectChange}
          >
            {Object.entries(ROLES_OPTIONS).map(
              ([roleName, roleValue], index) => (
                <option key={index} value={roleValue}>
                  {roleName}
                </option>
              ),
            )}
          </Select>
        </Flex>
        <InputAddressUser
          onInputChange={handleInputChange}
          inputAddress={String(inputAddress)}
          label={"Address to Revoke"}
        />
        <Button
          className="w-full justify-center items-center gap-2 px-6 bg-[#B1EF42] text-[#161617] rounded-lg"
          _hover={{ bg: "#B1EF42" }}
          _active={{ bg: "#B1EF42" }}
          isLoading={isloading}
          isDisabled={!isAddress(inputAddress.toString()) || !role}
          spinner={<BeatLoader size={8} color="white" />}
          onClick={() => {
            setIsLoading(true);
            handleRevokeGrantRole();
          }}
        >
          <CheckIcon className="w-[16px] h-[16px]" />
          Confirm
        </Button>
      </Flex>
    ),
    [ADMIN_ACTION.REVOKE_MANAGER]: (
      <Flex className="w-full flex-col">
        <InputAddressUser
          onInputChange={handleInputChange}
          inputAddress={String(inputAddress)}
          label={"Address to Revoke"}
        />
        <Button
          className="w-full justify-center items-center gap-2 px-6 bg-[#B1EF42] text-[#161617] rounded-lg"
          _hover={{ bg: "#B1EF42" }}
          _active={{ bg: "#B1EF42" }}
          isLoading={isloading}
          isDisabled={!isAddress(inputAddress.toString())}
          spinner={<BeatLoader size={8} color="white" />}
          onClick={() => {
            setIsLoading(true);
            handleRevokeManagerRole();
          }}
        >
          <CheckIcon className="w-[16px] h-[16px]" />
          Confirm
        </Button>
      </Flex>
    ),
    [ADMIN_ACTION.SET_ATTESTATION_TITLE]: (
      <Flex className="w-full flex-col">
        <Flex className="gap-4 pb-4 justify-start items-center">
          <Textarea
            className="text-slate-50 text-base font-normal leading-snug border-none"
            placeholder="Set the attestation title"
            _placeholder={{
              className: "text-slate-50 opacity-30",
            }}
            focusBorderColor={"#F5FFFF1A"}
            value={attestationTitleText}
            onChange={handleTextareaChange}
            rows={attestationTitleText.length > 50 ? 3 : 1}
            minH="unset"
            resize="none"
          />
        </Flex>
        <Flex className="w-full">
          <Text className="text-slate-50 text-sm font-normal leading-snug items-center ">
            Badge Valid ?
          </Text>
        </Flex>
        <Flex className="gap-4 pb-4 justify-start items-center">
          <Select
            placeholder="Role"
            className="flex text-slate-50 opacity-70 text-sm font-normal leading-tight"
            color="white"
            onChange={handleAttestationValidBadge}
          >
            <option value="Yes">Yes</option>
            <option value="No">No</option>
          </Select>
        </Flex>
        <Button
          className="w-full justify-center items-center gap-2 px-6 bg-[#B1EF42] text-[#161617] rounded-lg"
          _hover={{ bg: "#B1EF42" }}
          _active={{ bg: "#B1EF42" }}
          isLoading={isloading}
          isDisabled={!attestationTitleText}
          spinner={<BeatLoader size={8} color="white" />}
          onClick={() => {
            setIsLoading(true);
            handleAttestationTitle();
          }}
        >
          <CheckIcon className="w-[16px] h-[16px]" />
          Confirm
        </Button>
      </Flex>
    ),
    [ADMIN_ACTION.SET_SCHEMA]: (
      <Flex className="w-full flex-col">
        <Flex className="gap-4 pb-4 justify-start items-center">
          <Textarea
            className="text-slate-50 text-base font-normal leading-snug border-none"
            placeholder="Set SCHEMA UID"
            _placeholder={{
              className: "text-slate-50 opacity-30",
            }}
            focusBorderColor={"#F5FFFF1A"}
            value={schemaUID}
            onChange={handleTextareaSchemaUIDChange}
            rows={schemaUID.length > 50 ? 3 : 1}
            minH="unset"
            resize="none"
          />
        </Flex>
        <Flex className="gap-4 pb-4 justify-start items-center">
          <Select
            placeholder="Action schema"
            className="flex text-slate-50 opacity-70 text-sm font-normal leading-tight"
            color="white"
            onChange={handleAction}
          >
            {Object.entries(ACTIONS_OPTIONS).map(
              ([schemaUID, actionSchemaValue], index) => (
                <option key={index} value={actionSchemaValue}>
                  {schemaUID}
                </option>
              ),
            )}
          </Select>
        </Flex>
        <Button
          className="w-full justify-center items-center gap-2 px-6 bg-[#B1EF42] text-[#161617] rounded-lg"
          _hover={{ bg: "#B1EF42" }}
          _active={{ bg: "#B1EF42" }}
          isLoading={isloading}
          isDisabled={!schemaUID}
          spinner={<BeatLoader size={8} color="white" />}
          onClick={() => {
            setIsLoading(true);
            handleSetSchema();
          }}
        >
          <CheckIcon className="w-[16px] h-[16px]" />
          Confirm
        </Button>
      </Flex>
    ),
  };

  return (
    <>
      <Card
        background={"#F5FFFF0D"}
        className="w-full border border-[#F5FFFF14] border-opacity-[8] p-4 gap-2"
      >
        <Text className="text-slate-50 mb-2 text-sm font-medium leading-none">
          Select a function
        </Text>
        <Select
          placeholder="Select option"
          className="flex text-slate-50 opacity-70 text-sm font-normal leading-tight"
          color="white"
          onChange={handleActionSelectChange}
        >
          {ADMIN_OPTIONS.map((admin, index) => (
            <option key={index} value={admin.action}>
              {admin.action}
            </option>
          ))}
        </Select>
      </Card>

      {adminAction && renderAdminAction[adminAction]}
    </>
  );
};
