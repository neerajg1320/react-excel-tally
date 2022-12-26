export const presetColumns = [
  {
    label: "Sl. No.",
    key: "Sl. No.",
    width: 50
  },
  {
    label: "Transaction Date",
    key: "Transaction Date",
    width: 100
  },
  {
    label: "Value Date",
    key: "Value Date",
    width: 100
  },
  {
    label: "Description",
    key: "Description",
    width: 300
  },
  {
    label: "Chq / Ref number",
    key: "Chq / Ref number",
    width: 100
  },
  {
    label: "Debit",
    key: "Debit",
    width: 100
  },
  {
    label: "Credit",
    key: "Credit",
    width: 100
  },
  {
    label: "Balance",
    key: "Balance",
    width: 120
  },
  {
    label: "Dr / Cr",
    key: "Dr / Cr",
    width: 50
  },
  {
    label: "Category",
    key: "Category",
    edit: true,
    bulk: true,
    type: 'select',
    choices: [
      'Conveyance', 'Lodging', 'Stationary', 'Salary', 'Travel'
    ]
  },
  {
    label: "VoucherId",
    key: "VoucherId",
    edit: false,
    bulk: false,
  },
  {
    label: "Remarks",
    key: "Remarks",
    edit: true,
    bulk: true,
    type: 'input',
  }
];
