export const bankName = "Kotak";

export const headerKeynameMap= [
  {
    matchLabels: ["Sl. No."],
    keyName: "serialNum",
  },
  {
    matchLabels: ["Transaction Date"],
    keyName: "transactionDate",
    format: "dd/MM/yyyy"
  },
  {
    matchLabels: ["Value Date"],
    keyName: "valueDate",
    format: "dd/MM/yyyy"
  },
  {
    matchLabels: ["Description"],
    keyName: "description",
  },
  {
    matchLabels: ["Chq / Ref number"],
    keyName: "reference",
  },
  {
    matchLabels: ["Debit"],
    keyName: "debit",
  },
  {
    matchLabels: ["Credit"],
    keyName: "credit",
  },
  {
    matchLabels: ["Balance"],
    keyName: "balance",
  },
  {
    matchLabels: ["Dr / Cr"],
    keyName: "drCr",
  },
];
