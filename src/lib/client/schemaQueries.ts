//MODIFY
export const MANAGER_QUERY = `query Query($where: SchemaWhereUniqueInput!, 
$attestationsWhere2: AttestationWhereInput) {
  schema(where: $where) {
    attestations(where: $attestationsWhere2) {
      data
    }
  }
}`;

export const VILLAGER_QUERY = `query Attestations($where: AttestationWhereInput) {
  attestations(where: $where) {
    id
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

//MODIFY
export const ATTEST_RESPONSE_QUERY = `query Query($where: SchemaWhereUniqueInput!, 
$attestationsWhere2: AttestationWhereInput) {
  schema(where: $where) {
    attestations(where: $attestationsWhere2) {
      data
    }
  }
}`;
