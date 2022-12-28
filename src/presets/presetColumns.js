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
    required: true
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

export const statementColumns = [
  {
    header: "SNo",
    matchLabels: ["Sl. No."],
    keyName: "serialNum",
    width: 50
  },
  {
    header: "Transaction Date",
    matchLabels: ["Transaction Date", "Date"],
    keyName: "transactionDate",
    width: 100
  },
  {
    header: "Value Date",
    matchLabels: ["Value Date", "Value Dt"],
    keyName: "valueDate",
    width: 100
  },
  {
    header: "Description",
    matchLabels: ["Description", "Narration"],
    keyName: "description",
    width: 300
  },
  {
    header: "Reference",
    matchLabels: ["Chq / Ref number", "Chq./Ref.No."],
    keyName: "reference",
    width: 100
  },
  {
    header: "Debit",
    matchLabels: ["Debit", "Withdrawal Amt."],
    keyName: "debit",
    width: 100,
  },
  {
    header: "Credit",
    matchLabels: ["Credit", "Deposit Amt."],
    keyName: "credit",
    width: 100
  },
  {
    header: "Balance",
    matchLabels: ["Balance", "Closing Balance"],
    keyName: "balance",
    width: 120
  },
  {
    header: "DrCr",
    matchLabels: ["Dr / Cr"],
    keyName: "drCr",
    width: 50
  }
];

export const presetColumns = [...statementColumns, ...accountingColumns];
