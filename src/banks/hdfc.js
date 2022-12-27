export const bankName = "HDFC";

export const headerKeynameMap= [
  {
    matchLabels: ["Date"],
    keyName: "transactionDate",
  },
  {
    matchLabels: ["Value Dt"],
    keyName: "valueDate",
  },
  {
    matchLabels: ["Narration"],
    keyName: "description",
  },
  {
    matchLabels: ["Chq./Ref.No."],
    keyName: "reference",
  },
  {
    matchLabels: ["Withdrawal Amt."],
    keyName: "debit",
  },
  {
    matchLabels: ["Deposit Amt."],
    keyName: "credit",
  },
  {
    matchLabels: ["Closing Balance"],
    keyName: "balance",
  },
];
