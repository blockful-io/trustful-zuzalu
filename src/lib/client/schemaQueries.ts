//MODIFY
export const MANAGER_QUERY = `query Query($where: SchemaWhereUniqueInput!, 
$attestationsWhere2: AttestationWhereInput) {
  schema(where: $where) {
    attestations(where: $attestationsWhere2) {
      data
    }
  }
}`;

export const VILLAGER_QUERY = `query Query($where: AttestationWhereInput, $orderBy: [AttestationOrderByWithRelationInput!]) {
  attestations(where: $where, orderBy: $orderBy) {
    data
    id
    timeCreated
  }
}`;

//MODIFY
export const ATTEST_QUERY = `query Query($where: SchemaWhereUniqueInput!, 
$attestationsWhere2: AttestationWhereInput) {
  schema(where: $where) {
    attestations(where: $attestationsWhere2) {
      data
    }
  }
}`;

export const BADGE_QUERY = `query Query($where: AttestationWhereInput) {
  attestations(where: $where) {
    id
    data
    decodedDataJson
    timeCreated
    attester
    recipient
    txid
    refUID
    revoked
    schema {
      index
      id
    }
  }
}`;

//MODIFY
export const ATTEST_RESPONSE_QUERY = `query Query($where: SchemaWhereUniqueInput!, 
$attestationsWhere2: AttestationWhereInput) {
  schema(where: $where) {
    attestations(where: $attestationsWhere2) {
      data
    }
  }
}`;

// Get data from the villager schema where data equals check-in
export const ID_CHECK_IN_QUERY = `query Query($where: AttestationWhereInput) {
  attestations(where: $where) {
    id
    revoked
  }
}`;

// Check ENS name
export const ENS_ADDR_QUERY = `query Query($where: Domain_filter) {
  domains(where: $where) {
    resolvedAddress {
      id
    }
  }
}`;

export const ENS_REVERSE_QUERY = `query getReverseRecord($address: String!) {
  domains(where: { resolvedAddress: $address }) {
    name
  }
}`;
