export const presetColumns = [
  {
    label: "Sl. No.",
    keyName: "serialNum",
    width: 50
  },
  {
    label: "Transaction Date",
    keyName: "transactionDate",
    width: 100
  },
  {
    label: "Value Date",
    keyName: "valueDate",
    width: 100
  },
  {
    label: "Description",
    keyName: "description",
    width: 300
  },
  {
    label: "Chq / Ref number",
    keyName: "refNumber",
    width: 100
  },
  {
    label: "Debit",
    keyName: "debit",
    width: 100
  },
  {
    label: "Credit",
    keyName: "credit",
    width: 100
  },
  {
    label: "Balance",
    keyName: "balance",
    width: 120
  },
  {
    label: "Dr / Cr",
    keyName: "drCr",
    width: 50
  },
  {
    label: "Category",
    keyName: "category",
    edit: true,
    bulk: true,
    type: 'select',
    choices: [
      'Conveyance', 'Lodging', 'Stationary', 'Salary', 'Travel'
    ]
  },
  {
    label: "VoucherId",
    keyName: "voucherId",
    edit: false,
    bulk: false,
  },
  {
    label: "Remarks",
    keyName: "remarks",
    edit: true,
    bulk: true,
    type: 'input',
  }
];
