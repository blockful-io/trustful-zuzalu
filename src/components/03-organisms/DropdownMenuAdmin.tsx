import { useContext, useEffect, useState, type ChangeEvent } from "react";

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
import { useRouter } from "next/navigation";
import { BeatLoader } from "react-spinners";
import { isAddress } from "viem";
import { optimism } from "viem/chains";
import { useAccount, useSwitchChain } from "wagmi";

import { InputAddressUser } from "@/components/02-molecules/";
import { useNotify } from "@/hooks";
import { ROLES, ZUVILLAGE_SCHEMAS } from "@/lib/client/constants";
import { ID_CHECK_IN_QUERY } from "@/lib/client/schemaQueries";
import { GiveBadgeContext } from "@/lib/context/GiveBadgeContext";
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
  MANAGER_OPTIONS,
  ROLES_OPTIONS,
} from "@/utils/ui-utils";

export const DropdownMenuAdmin = () => {
  const { address, chainId } = useAccount();
  const { push } = useRouter();
  const { notifyError } = useNotify();
  const toast = useToast();

  const [connectedRole, setConnectedRole] = useState<ROLES | null>(null);
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
  const { setNewTitleAdded } = useContext(GiveBadgeContext);
  const { switchChain } = useSwitchChain();

  // Updates the validAddress when the inputAddress changes
  useEffect(() => {
    if (inputAddress && isAddress(inputAddress)) {
      setValidAddress(new EthereumAddress(inputAddress));
    }
  }, [inputAddress]);

  useEffect(() => {
    handleConnectedAddress();
  }, [address]);

  useEffect(() => {
    setRole(null);
  }, [adminAction]);

  // Call the grantRole function with the current state values
  const handleGrantRole = async () => {
    if (!address || !inputAddress || !role || !validAddress) {
      setIsLoading(false);
      notifyError({
        title: "Please connect first",
        message: "No address found.",
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

    setIsLoading(false);

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
  };

  // Call the revokeRole function with the current state values
  const handleRevokeRole = async () => {
    if (!address || !inputAddress || !role || !validAddress) {
      setIsLoading(false);
      notifyError({
        title: "Please connect first",
        message: "No address found.",
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

    const userHasRole = await hasRole(
      role,
      validAddress.address as `0x${string}`,
    );

    if (!userHasRole) {
      setIsLoading(false);
      notifyError({
        title: `Unauthorized Access`,
        message: "Address doesn't have this role.",
      });
      return;
    }

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

    setIsLoading(false);

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
  };

  const handleAttestationTitle = async () => {
    if (!address) {
      setIsLoading(false);
      notifyError({
        title: "Please connect first",
        message: "No address found.",
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

    setIsLoading(false);

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
    setNewTitleAdded(true);
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
    }
  };

  const handleSetSchema = async () => {
    if (!address) {
      setIsLoading(false);
      notifyError({
        title: "Please connect first",
        message: "No address found.",
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

    setIsLoading(false);
  };

  const handleRevokeManagerRole = async () => {
    if (chainId !== optimism.id) {
      notifyError({
        title: "Unsupported network",
        message:
          "Please switch to the Optmism network to use this application.",
      });
      switchChain({ chainId: optimism.id });
      return;
    }

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

    setIsLoading(false);

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

  // Defines the connected user to use the admin menu
  const handleConnectedAddress = async () => {
    if (address) {
      if (chainId !== optimism.id) {
        notifyError({
          title: "Unsupported network",
          message:
            "Please switch to the Optmism network to use this application.",
        });
        switchChain({ chainId: optimism.id });
        return;
      }
      const isRoot = await hasRole(ROLES.ROOT, address);
      if (isRoot) setConnectedRole(ROLES.ROOT);
      else {
        const isManager = await hasRole(ROLES.MANAGER, address);
        if (isManager) setConnectedRole(ROLES.MANAGER);
        else {
          push("/");
          notifyError({
            title: "MERE MORTAL",
            message: "Get out of here! YOU-NO-ADMIN!!",
          });
        }
      }
    }
  };

  // Handle the input change and validate the address
  const handleInputChange = (value: string) => {
    setInputAddress(value);
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

  // Get the current action selected from the Admin menu and move to state
  const handleAdminActionSelectChange = (
    event: ChangeEvent<HTMLSelectElement>,
  ) => {
    ADMIN_OPTIONS.filter((admin) => {
      if (event.target.value === "") {
        setAdminAction(null);
      }
      if (event.target.value === admin.action) {
        setAdminAction(admin.action);
      }
    });
  };

  // Get the current action selected from the Manager menu and move to state
  const handleManagerActionSelectChange = (
    event: ChangeEvent<HTMLSelectElement>,
  ) => {
    MANAGER_OPTIONS.filter((admin) => {
      if (event.target.value === "") {
        setAdminAction(null);
      }
      if (event.target.value === admin.action) {
        setAdminAction(admin.action);
      }
    });
  };

  const handleAttestationValidBadge = (
    event: ChangeEvent<HTMLSelectElement>,
  ): void => {
    const selectedRoleValue = event.target.value;

    if (selectedRoleValue === "Yes") {
      setAttestationBadgeIsValid(true);
    } else if (selectedRoleValue === "No") {
      setAttestationBadgeIsValid(false);
    }
  };

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

  const renderAdminAction: Record<ADMIN_ACTION, React.JSX.Element> = {
    [ADMIN_ACTION.GRANT_ROLE]: (
      <Card
        background={"#F5FFFF0D"}
        className="w-full border border-[#F5FFFF14] border-opacity-[8] p-4 gap-2"
      >
        <Flex className="w-full flex-col">
          <Flex className="gap-4 pb-4 justify-start items-center">
            <Select
              placeholder="Select Role"
              className="flex text-slate-50 opacity-70 font-normal leading-tight"
              color="white"
              onChange={handleRoleSelectChange}
              focusBorderColor={"#B1EF42"}
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
            label="Address to Grant Role"
            onInputChange={handleInputChange}
            inputAddress={String(inputAddress)}
          />
          <Box>
            <Flex className="pb-4 gap-4 items-center">
              <Text className="flex min-w-[80px] text-slate-50 opacity-70 text-sm font-normal leading-tight">
                &#x26A0;WARNING&#x26A0;
                <br />
                {`This is an access control function that works outside the scope of how Trustul is supposed to work and the behaviour of the dApp might not be as expected once you override.`}
                <br />
                {`Are you sure you want to proceed?`}
              </Text>
            </Flex>
          </Box>
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
      </Card>
    ),
    [ADMIN_ACTION.REVOKE_ROLE]: (
      <Card
        background={"#F5FFFF0D"}
        className="w-full border border-[#F5FFFF14] border-opacity-[8] p-4 gap-2"
      >
        <Flex className="w-full flex-col">
          <Flex className="gap-4 pb-4 justify-start items-center">
            <Select
              placeholder="Select Role"
              className="flex text-slate-50 opacity-70 font-normal leading-tight"
              color="white"
              onChange={handleRoleSelectChange}
              focusBorderColor={"#B1EF42"}
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
            label={"Address to Revoke Role"}
          />
          <Box>
            <Flex className="pb-4 gap-4 items-center">
              <Text className="flex min-w-[80px] text-slate-50 opacity-70 text-sm font-normal leading-tight">
                &#x26A0;WARNING&#x26A0;
                <br />
                {`This is an access control function that works outside the scope of how Trustul is supposed to work and the behaviour of the dApp might not be as expected once you override.`}
                <br />
                {`Are you sure you want to proceed?`}
              </Text>
            </Flex>
          </Box>
          <Button
            className="w-full justify-center items-center gap-2 px-6 bg-[#B1EF42] text-[#161617] rounded-lg"
            _hover={{ bg: "#B1EF42" }}
            _active={{ bg: "#B1EF42" }}
            isLoading={isloading}
            isDisabled={!isAddress(inputAddress.toString()) || !role}
            spinner={<BeatLoader size={8} color="white" />}
            onClick={() => {
              setIsLoading(true);
              handleRevokeRole();
            }}
          >
            <CheckIcon className="w-[16px] h-[16px]" />
            Confirm
          </Button>
        </Flex>
      </Card>
    ),
    [ADMIN_ACTION.REVOKE_MANAGER]: (
      <Card
        background={"#F5FFFF0D"}
        className="w-full border border-[#F5FFFF14] border-opacity-[8] p-4 gap-2"
      >
        <Flex className="w-full flex-col">
          <InputAddressUser
            onInputChange={handleInputChange}
            inputAddress={String(inputAddress)}
            label={"Address to Revoke"}
          />
          <Box>
            <Flex className="pb-4 gap-4 items-center">
              <Text className="flex min-w-[80px] text-slate-50 opacity-70 text-sm font-normal leading-tight">
                &#x26A0;WARNING&#x26A0;
                <br />
                {`This action is irreversible. You are revoking the Manager badge from the address ${inputAddress ? inputAddress : "above"}. He will not be able to get this badge again and its status will show revoked for eternity in the EAS protocol. Are you sure you want to proceed?`}
              </Text>
            </Flex>
          </Box>
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
      </Card>
    ),
    [ADMIN_ACTION.SET_ATTESTATION_TITLE]: (
      <Card
        background={"#F5FFFF0D"}
        className="w-full border border-[#F5FFFF14] border-opacity-[8] p-4 gap-2"
      >
        <Flex className="w-full flex-col">
          <Flex className="gap-4 pb-4 justify-start items-center">
            <Textarea
              className="text-slate-50 opacity-70 text-base font-normal leading-snug"
              color="white"
              placeholder="Set the Badge Title..."
              _placeholder={{
                className: "text-slate-50",
              }}
              focusBorderColor={"#B1EF42"}
              value={attestationTitleText}
              onChange={handleTextareaChange}
              rows={attestationTitleText.length > 50 ? 3 : 1}
              minH="unset"
              resize="none"
            />
          </Flex>
          <Flex className="gap-4 pb-4 justify-start items-center">
            <Select
              className="flex opacity-70 text-slate-50 font-normal leading-tight"
              color="white"
              placeholder="Select an option"
              onChange={handleAttestationValidBadge}
              focusBorderColor={"#B1EF42"}
            >
              <option value="Yes">Yes</option>
              <option value="No">No</option>
            </Select>
          </Flex>
          <Box>
            <Flex className="pb-4 gap-4 items-center">
              <Text className="flex min-w-[80px] text-slate-50 opacity-70 text-sm font-normal leading-tight">
                Badge Validity:
                <br />
                {`Yes = Can be emitted/created/attested on the contract.`}
                <br />
                {`No = Cannot be emitted/created/attested on the contract.`}
              </Text>
            </Flex>
          </Box>
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
      </Card>
    ),
    [ADMIN_ACTION.SET_SCHEMA]: (
      <Card
        background={"#F5FFFF0D"}
        className="w-full border border-[#F5FFFF14] border-opacity-[8] p-4 gap-2"
      >
        <Flex className="w-full flex-col">
          <Flex className="gap-4 pb-4 justify-start items-center">
            <Textarea
              className="text-slate-50 opacity-70 text-base font-normal leading-snug"
              placeholder="Set Schema UID"
              _placeholder={{
                className: "text-slate-50",
              }}
              focusBorderColor={"#B1EF42"}
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
              focusBorderColor={"#B1EF42"}
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
          <Box>
            <Flex className="pb-4 gap-4 items-center">
              <Text className="flex min-w-[80px] text-slate-50 opacity-70 text-sm font-normal leading-tight">
                &#x26A0;WARNING&#x26A0;
                <br />
                {`Only use call this function if you really know what you are doing as it will affect how the Resolver Contract works with EAS and Trusful.`}
              </Text>
            </Flex>
          </Box>
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
      </Card>
    ),
  };

  return (
    <>
      {connectedRole ? (
        <>
          <Card
            background={"#F5FFFF0D"}
            className="w-full border border-[#F5FFFF14] border-opacity-[8] p-4 gap-2"
          >
            <Text className="text-slate-50 mb-2 font-medium leading-none">
              Select a function
            </Text>
            {connectedRole === ROLES.ROOT ? (
              <Select
                placeholder="Select option"
                className="flex text-slate-50 opacity-70 font-normal leading-tight"
                color="white"
                onChange={handleAdminActionSelectChange}
                focusBorderColor={"#B1EF42"}
              >
                {ADMIN_OPTIONS.map((admin, index) => (
                  <option key={index} value={admin.action}>
                    {admin.action}
                  </option>
                ))}
              </Select>
            ) : connectedRole === ROLES.MANAGER ? (
              <Select
                placeholder="Select option"
                className="flex text-slate-50 opacity-70 font-normal leading-tight"
                color="white"
                onChange={handleManagerActionSelectChange}
                focusBorderColor={"#B1EF42"}
              >
                {MANAGER_OPTIONS.map((admin, index) => (
                  <option key={index} value={admin.action}>
                    {admin.action}
                  </option>
                ))}
              </Select>
            ) : null}
          </Card>
          {adminAction && renderAdminAction[adminAction]}
        </>
      ) : (
        <Box flex={1} className="flex justify-center items-center">
          <BeatLoader size={8} color="#B1EF42" />
        </Box>
      )}
    </>
  );
};
