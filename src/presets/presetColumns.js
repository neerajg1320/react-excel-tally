export const statementColumns = [
  {
    header: "SNo",
    matchLabels: ["Sl. No."],
    keyName: "serialNum",
    width: 50,
    type: "number",
    required: false
  },
  {
    header: "Transaction Date",
    matchLabels: ["Transaction Date", "Date"],
    keyName: "transactionDate",
    width: 100,
    type: "date",
    required: true
  },
  {
    header: "Value Date",
    matchLabels: ["Value Date", "Value Dt"],
    keyName: "valueDate",
    width: 100,
    type: "date",
    required: false
  },
  {
    header: "Description",
    matchLabels: ["Description", "Narration"],
    keyName: "description",
    width: 300,
    type: "string",
    required: true
  },
  {
    header: "Reference",
    matchLabels: ["Chq / Ref number", "Chq./Ref.No."],
    keyName: "reference",
    width: 100,
    type: "string",
    required: false
  },
  {
    header: "Debit",
    matchLabels: ["Debit", "Withdrawal Amt."],
    keyName: "debit",
    width: 100,
    type: "number",
    required: false
  },
  {
    header: "Credit",
    matchLabels: ["Credit", "Deposit Amt."],
    keyName: "credit",
    width: 100,
    type: "number",
    required: false
  },
  {
    header: "Balance",
    matchLabels: ["Balance", "Closing Balance"],
    keyName: "balance",
    width: 120,
    type: "number",
    required: true
  },
  {
    header: "DrCr",
    matchLabels: ["Dr / Cr"],
    keyName: "drCr",
    width: 50,
    type: "string",
    required: false
  }
];

export const accountingColumns = [
  {
    header: "Category",
    matchLabels: ["Category"],
    keyName: "category",
    edit: true,
    bulk: true,
    type: 'select',
    choices: [
      'Conveyance', 'Lodging', 'Stationary', 'Salary', 'Travel', "Suspense"
    ],
    defaultValue: "Suspense",
    required: true
  },
  {
    header: "Voucher Id",
    matchLabels: ["VoucherId"],
    keyName: "voucherId",
    edit: false,
    bulk: false,
    defaultValue: -1,
    required: true,
    hidden: true
  },
  {
    header: "Remarks",
    matchLabels: ["Remarks"],
    keyName: "remarks",
    edit: true,
    bulk: true,
    type: 'input',
    defaultValue: ""
  }
];

export const presetColumns = [...statementColumns, ...accountingColumns];
