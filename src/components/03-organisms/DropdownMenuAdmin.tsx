import { useEffect, useState, type ChangeEvent } from "react";

import { CheckIcon } from "@chakra-ui/icons";
import { Card, Text, Select, Flex, Button, Textarea } from "@chakra-ui/react";
import { BeatLoader } from "react-spinners";
import { isAddress } from "viem";
import { useAccount } from "wagmi";

import { InputAddressUser } from "@/components/02-molecules/";
import { ROLES } from "@/lib/client/constants";
import { hasRole } from "@/lib/service";
import { grantRole } from "@/lib/service/grantRole";
// import { revoke } from "@/lib/service/revoke";
import { setAttestationTitle } from "@/lib/service/setAttestationTitle";
import { EthereumAddress } from "@/lib/shared/types";
import { ADMIN_ACTION, ADMIN_OPTIONS, ROLES_OPTIONS } from "@/utils/ui-utils";

export const DropdownMenuAdmin = () => {
  const [adminAction, setAdminAction] = useState<ADMIN_ACTION | null>(null);
  const [role, setRole] = useState<ROLES | null>(null);
  const [inputAddress, setInputAddress] = useState<string>("");
  const [validAddress, setValidAddress] = useState<EthereumAddress | null>(
    null,
  );
  const [isloading, setIsLoading] = useState<boolean>(false);
  const [attestationTitleText, setAttestationTitleTex] = useState<string>("");
  const { address } = useAccount();

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
      const transactionGrantRole = await grantRole({
        from: validAddress.address as `0x${string}`,
        role: role,
        account: address,
        msgValue: BigInt(0),
      });
      transactionGrantRole ? setIsLoading(true) : setIsLoading(false);
    }
    setIsLoading(false);
  };

  // Call the revoke function with the current state values
  const handleRevokeGrantRole = async () => {
    if (address && inputAddress && role && validAddress) {
      console.log("handleRevokesssssssss = ", role);
      console.log("validAddress = ", validAddress.address);

      const userHasRole = await hasRole(
        role,
        validAddress.address as `0x${string}`,
      );
      if (userHasRole) {
        console.log("userHasRole", userHasRole);
        // const transactionGrantRole = await revoke({
        //   from: validAddress.address as `0x${string}`,
        //   schemaUID:,
        //   revocationRequestData: {
        //     uid:,
        //     data: ,
        //     value: BigInt(0),
        //   },
        // });
        // transactionGrantRole ? setIsLoading(true) : setIsLoading(false);
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
    setAttestationTitleTex(event.target.value);
    handleAttestationTitle();
  };

  const handleAttestationTitle = async () => {
    if (address && inputAddress && validAddress) {
      const transactionAttestationTitle = await setAttestationTitle({
        from: validAddress.address as `0x${string}`,
        isValid: true, // TODO: Confirm if it's always true
        title: attestationTitleText, //  TODO: Confirm if it's attestationsTitle
        value: BigInt(0), //  TODO: Confirm if it's always 0n
      });
      transactionAttestationTitle ? setIsLoading(true) : setIsLoading(false);
    }
    setIsLoading(false);
  };

  return (
    <>
      <Card
        background={"#F5FFFF0D"}
        className="w-full border border-[#F5FFFF14] border-opacity-[8] p-4 gap-2"
      >
        <Text className="text-slate-50 mb-2 text-sm font-medium leading-none">
          Select a Badge User Role
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
      {adminAction === ADMIN_ACTION.GRANT_ROLE && (
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
      )}
      {adminAction === ADMIN_ACTION.REVOKE_ROLE && (
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
      )}
      {adminAction === ADMIN_ACTION.SET_ATTESTATION_TITLE && (
        <Flex className="w-full flex-col">
          <Flex className="gap-4 pb-4 justify-start items-center"></Flex>
          <InputAddressUser
            label="Enter the address"
            onInputChange={handleInputChange}
            inputAddress={String(inputAddress)}
          />
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
              rows={1}
              minH="unset"
              resize="none"
            />
          </Flex>
          <Button
            className="w-full justify-center items-center gap-2 px-6 bg-[#B1EF42] text-[#161617] rounded-lg"
            _hover={{ bg: "#B1EF42" }}
            _active={{ bg: "#B1EF42" }}
            isLoading={isloading}
            isDisabled={
              !isAddress(inputAddress.toString()) || !attestationTitleText
            }
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
      )}
      {adminAction === ADMIN_ACTION.SET_SCHEMA && <div>ok</div>}
    </>
  );
};
