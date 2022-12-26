export const presetColumns = [
  {
    header: "SNo",
    label: "Sl. No.",
    keyName: "serialNum",
    width: 50
  },
  {
    header: "Transaction Date",
    label: "Transaction Date",
    keyName: "transactionDate",
    width: 100
  },
  {
    header: "Value Date",
    label: "Value Date",
    keyName: "valueDate",
    width: 100
  },
  {
    header: "Description",
    label: "Description",
    keyName: "description",
    width: 300
  },
  {
    header: "Reference",
    label: "Chq / Ref number",
    keyName: "refNumber",
    width: 100
  },
  {
    header: "Debit",
    label: "Debit",
    keyName: "debit",
    width: 100
  },
  {
    header: "Credit",
    label: "Credit",
    keyName: "credit",
    width: 100
  },
  {
    header: "Balance",
    label: "Balance",
    keyName: "balance",
    width: 120
  },
  {
    header: "DrCr",
    label: "Dr / Cr",
    keyName: "drCr",
    width: 50
  },
  {
    header: "Category",
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
    header: "Voucher Id",
    label: "VoucherId",
    keyName: "voucherId",
    edit: false,
    bulk: false,
  },
  {
    header: "Remarks",
    label: "Remarks",
    keyName: "remarks",
    edit: true,
    bulk: true,
    type: 'input',
  }
];
