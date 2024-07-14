import { useEffect, useState, type ChangeEvent } from "react";

import { CheckIcon } from "@chakra-ui/icons";
import { Card, Text, Select, Flex, Button } from "@chakra-ui/react";
import { BeatLoader } from "react-spinners";
import { isAddress } from "viem";
import { useAccount } from "wagmi";

import { InputAddressUser } from "@/components/02-molecules/";
import { ROLES } from "@/lib/client/constants";
import { grantRole } from "@/lib/service/grantRole";
// import { revoke } from "@/lib/service/revoke";
import { EthereumAddress } from "@/lib/shared/types";
import { ADMIN_ACTION, ADMIN_OPTIONS, ROLES_OPTIONS } from "@/utils/ui-utils";

export const DropdownMenuAdmin = () => {
  const [adminAction, setAdminAction] = useState<ADMIN_ACTION | null>(null);
  const [role, setRole] = useState<ROLES | null>(null);
  const [inputAddress, setInputAddress] = useState<string>("");
  const [validAddress, setValidAddress] = useState<
    `0x${string}` | EthereumAddress | string
  >("");
  const [loadingConfirm, setLoadingConfirm] = useState<boolean>(false);

  const { address } = useAccount();

  // TODO: add timeout to set the address correctly
  const validatingAddress = (inputAddress: string) => {
    if (!isAddress(inputAddress)) {
      setValidAddress(new EthereumAddress(inputAddress));
    } else if (isAddress(inputAddress)) {
      setValidAddress(inputAddress);
    }
  };

  // Handle the input change and validate the address
  const handleInputChange = (value: string) => {
    setInputAddress(value);
    validatingAddress(value);
  };

  useEffect(() => {
    setRole(null);
  }, [adminAction]);

  console.log("adminAction", adminAction);
  console.log("role", role);
  console.log("inputAddress", inputAddress);

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

  const handleGrantRole = async () => {
    if (address && inputAddress && role) {
      const transactionGrantRole = await grantRole({
        from: validAddress as `0x${string}`,
        role: role,
        account: address,
        msgValue: BigInt(0),
      });
      transactionGrantRole ? setLoadingConfirm(true) : setLoadingConfirm(false);
    }
    setLoadingConfirm(false);
  };

  // const handleRevokeGrantRole = async () => {
  //   if (address && inputAddress && role) {
  //     const transactionGrantRole = await revoke({
  //       from: validAddress as `0x${string}`,
  //       schemaUID:,
  //       revocationRequestData: {
  //         uid:,
  //         data: ,
  //         value: BigInt(0),
  //       },
  //     });
  //     transactionGrantRole ? setLoadingConfirm(true) : setLoadingConfirm(false);
  //   }
  //   setLoadingConfirm(false);
  // };

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
            onInputChange={handleInputChange}
            inputAddress={String(inputAddress)}
          />
          <Button
            className="w-full justify-center items-center gap-2 px-6 bg-[#B1EF42] text-[#161617] rounded-lg"
            _hover={{ bg: "#B1EF42" }}
            _active={{ bg: "#B1EF42" }}
            isLoading={loadingConfirm}
            isDisabled={!isAddress(inputAddress.toString()) || !role}
            spinner={<BeatLoader size={8} color="white" />}
            onClick={() => {
              setLoadingConfirm(true);
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
          />
          <Button
            className="w-full justify-center items-center gap-2 px-6 bg-[#B1EF42] text-[#161617] rounded-lg"
            _hover={{ bg: "#B1EF42" }}
            _active={{ bg: "#B1EF42" }}
            isLoading={loadingConfirm}
            isDisabled={!isAddress(inputAddress.toString()) || !role}
            spinner={<BeatLoader size={8} color="white" />}
            onClick={() => {
              setLoadingConfirm(true);
              // handleRevokeGrantRole(); //
            }}
          >
            <CheckIcon className="w-[16px] h-[16px]" />
            Confirm
          </Button>
        </Flex>
      )}
    </>
  );
};
