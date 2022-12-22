export const presetColumns = [
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
    label: "Value Date",
    key: "Value Date",
    edit: false,
    bulk: false,
    type: 'input',
    show: false
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
