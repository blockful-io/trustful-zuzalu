import { Flex, Input } from "@chakra-ui/react";

import { UserIcon } from "@/components/01-atoms";

interface InputAddressUserProps {
  onInputChange: (value: string) => void;
  inputAddress: string;
  label: string;
}

export const InputAddressUser = ({
  onInputChange,
  inputAddress,
  label,
}: InputAddressUserProps) => {
  return (
    <Flex className="gap-4 pb-4 justify-start items-center">
      <UserIcon className="text-[#B1EF42]" />
      <Input
        className="text-slate-50 text-base font-normal leading-snug border opacity-70"
        placeholder={label}
        _placeholder={{
          className: "text-slate-50",
        }}
        focusBorderColor={"#B1EF42"}
        value={inputAddress}
        onChange={(e) => onInputChange(e.target.value)}
      />
    </Flex>
  );
};
