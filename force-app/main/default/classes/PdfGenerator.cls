public with sharing class PdfGenerator {
  @AuraEnabled
  public static Account getAccount(Id accountId) {
    try {
      return [
        SELECT
          Id,
          Name,
          Phone,
          Type,
          Industry,
          (SELECT Id, FirstName, LastName FROM Contacts)
        FROM Account
        WHERE Id = :accountId
        WITH SECURITY_ENFORCED
      ];
    } catch (Exception e) {
      throw new AuraHandledException(e.getMessage());
    }
  }
}
