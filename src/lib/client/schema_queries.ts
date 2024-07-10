export const VILLAGER_QUERY = `query Query($where: SchemaWhereUniqueInput!, 
$attestationsWhere2: AttestationWhereInput) {
  schema(where: $where) {
    attestations(where: $attestationsWhere2) {
      data
    }
  }
}`;
