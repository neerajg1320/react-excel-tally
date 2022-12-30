import {dateFromString} from "../utils/types";

export const bankName = "Kotak";

export const headerKeynameMap= [
  {
    matchLabels: ["Sl. No."],
    keyName: "serialNum",
  },
  {
    matchLabels: ["Transaction Date"],
    keyName: "transactionDate",
    // format: "dd/MM/yyyy hh:mm a..aaa",
    parse: (val, rowIndex) => {
      if (val) {
        const firstPart = val.split(' ')[0];
        // if (rowIndex == 22) {
        //   console.log(`${rowIndex} firstPart=${firstPart}`);
        // }
        return dateFromString(firstPart, "dd/MM/yyyy");
      }
      return val;
    }
  },
  {
    matchLabels: ["Value Date"],
    keyName: "valueDate",
    format: "dd/MM/yyyy"
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
];
