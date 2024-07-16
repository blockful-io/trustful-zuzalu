export class EthereumAddress {
  static readonly ETHEREUM_ADDRESS_LENGTH = 40;
  static readonly pattern = new RegExp(
    `^0x[a-fA-F0-9]{${EthereumAddress.ETHEREUM_ADDRESS_LENGTH}}$`,
  );

  public address: `0x${string}`;

  constructor(private add: string | `0x${string}`) {
    if (!EthereumAddress.pattern.test(this.add)) {
      throw new Error(`Invalid Ethereum address: ${add}`);
    }

    this.address = add.toLowerCase() as `0x${string}`;
  }

  toString() {
    return this.address;
  }

  equals(otherAddress: EthereumAddress | undefined | null) {
    if (otherAddress === undefined || otherAddress === null) return false;

    let isEqual = false;
    try {
      isEqual = this.address === otherAddress.address;
    } finally {
      return isEqual;
    }
  }

  getEllipsedAddress() {
    return this.address.slice(0, 6) + "..." + this.address.slice(-4);
  }
}
