import {valToString} from "../utils/types";

export const MOCK_COLUMNS = [
  {
    label: 'Id',
    key: 'id',
    disableFilters: true,
  },
  {
    label: 'First Name',
    key: 'first_name'
  },
  {
    label: 'Last Name',
    key: 'last_name'
  },
  {
    label: 'Date of Birth',
    key: 'date_of_birth',
    Cell: ({ value }) => {
      // return String(value);
      return  valToString(new Date(value));
    }
  },
  {
    label: 'Country',
    key: 'country',
    edit: true,
    bulk: true,
    type: "select",
    choices: [
      "Select",
      "Australia",
      "India",
      "Indonesia",
      "Netherlands",
      "Chile",
      "Portugal",
      "UK",
      "US"
    ],
    defaultChoice: "Portugal"
  },
  {
    label: 'Phone',
    key: 'phone',
    edit: true,
    bulk: true,
    type: "input",
  },
  {
    label: 'Remarks',
    key: 'remarks',
    edit: true,
    bulk: true,
    type: "input"
  }
];