export const presetColumns = [
  {
    header: "SNo",
    matchLabels: ["Sl. No."],
    keyName: "serialNum",
    width: 50
  },
  {
    header: "Transaction Date",
    matchLabels: ["Transaction Date"],
    keyName: "transactionDate",
    width: 100
  },
  {
    header: "Value Date",
    matchLabels: ["Value Date"],
    keyName: "valueDate",
    width: 100
  },
  {
    header: "Description",
    matchLabels: ["Description"],
    keyName: "description",
    width: 300
  },
  {
    header: "Reference",
    matchLabels: ["Chq / Ref number"],
    keyName: "reference",
    edit: true,
    width: 100
  },
  {
    header: "Debit",
    matchLabels: ["Debit"],
    keyName: "debit",
    width: 100
  },
  {
    header: "Credit",
    matchLabels: ["Credit"],
    keyName: "credit",
    width: 100
  },
  {
    header: "Balance",
    matchLabels: ["Balance"],
    keyName: "balance",
    width: 120
  },
  {
    header: "DrCr",
    matchLabels: ["Dr / Cr"],
    keyName: "drCr",
    width: 50
  },
  {
    header: "Category",
    matchLabels: ["Category"],
    keyName: "category",
    edit: true,
    bulk: true,
    type: 'select',
    choices: [
      'Conveyance', 'Lodging', 'Stationary', 'Salary', 'Travel'
    ]
  },
  {
    header: "Voucher Id",
    matchLabels: ["VoucherId"],
    keyName: "voucherId",
    edit: false,
    bulk: false,
  },
  {
    header: "Remarks",
    matchLabels: ["Remarks"],
    keyName: "remarks",
    edit: true,
    bulk: true,
    type: 'input',
  }
];
