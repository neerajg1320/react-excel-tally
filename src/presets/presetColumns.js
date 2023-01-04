import {indiaDateFormat} from "../utils/types";

export const statementColumns = [
  {
    header: "SNo",
    matchLabels: ["Sl. No."],
    keyName: "serialNum",
    width: 50,
    type: "number",
    required: false,
    alignment: "center"
  },
  {
    header: "Transaction Date",
    matchLabels: ["Transaction Date", "Date"],
    keyName: "transactionDate",
    width: 120,
    type: "date",
    // format: `${indiaDateFormat} HH:mm`,
    required: true
  },
  {
    header: "Value Date",
    matchLabels: ["Value Date", "Value Dt"],
    keyName: "valueDate",
    width: 120,
    type: "date",
    format: indiaDateFormat,
    required: false
  },
  {
    header: "Description",
    matchLabels: ["Description", "Narration"],
    keyName: "description",
    width: 300,
    type: "string",
    required: true,
    format: "yyyy-MM-dd",
  },
  {
    header: "Reference",
    matchLabels: ["Chq / Ref number", "Chq./Ref.No."],
    keyName: "reference",
    width: 100,
    type: "string",
    acceptedTypes: ["string", "number"],
    required: false
  },
  {
    header: "Debit",
    matchLabels: ["Debit", "Withdrawal Amt."],
    keyName: "debit",
    width: 100,
    type: "number",
    required: false,
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
    required: false,
    alignment: "center"
  }
];

export const accountingColumns = [
  {
    header: "Category",
    matchLabels: ["Category"],
    keyName: "category",
    edit: true,
    bulk: true,
    type: 'select', // This needs to be fixed now
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
    hidden: false
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
