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
