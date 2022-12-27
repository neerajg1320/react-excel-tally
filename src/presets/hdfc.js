const hdfcHeaderKeynameMap= [
  {
    matchLabels: ["Sl. No."],
    keyName: "serialNum",
  },
  {
    matchLabels: ["Transaction Date"],
    keyName: "transactionDate",
  },
  {
    matchLabels: ["Value Date"],
    keyName: "valueDate",
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
]

const hdfcHeaderMapper = {
  "name": "HDFC",
  "headerKeynameMap": hdfcHeaderKeynameMap
}

export default hdfcHeaderMapper;

