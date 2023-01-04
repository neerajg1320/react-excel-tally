import {remoteCall} from "../../communication/electron";
import {setResponseIds} from "./tallyActions";

export const addVouchers = (vouchers, targetCompany, bank) => {
  console.log(`targetCompany=${targetCompany}`);

  return async (dispatch, getState) => {
    remoteCall('tally:command:vouchers:add', {targetCompany, vouchers, bank})
        .then((response) => {
          // console.log(`handleResponse: response=${JSON.stringify(response, null, 2)}`);

          const resultIds = Object.fromEntries(response.map(res => [res.index, res.voucherId]));
          // console.log(`resultIds=`, resultIds);

          dispatch(setResponseIds(resultIds));

        })
        .catch(error => {
          alert(error.reason);
        });
  }
}

export const deleteVouchers = (ids, targetCompany) => {
  return async (dispatch, getState) => {
    const data = getState().rows;
    const vouchers = data.filter(item => ids.includes(item.id));

    remoteCall('tally:command:vouchers:delete', {targetCompany, vouchers})
        .then((response) => {
          console.log(response);
          // dispatch(deleteRows(ids));
        })
        .catch((error) => {
          alert("Error deleting vouchers. Make sure master Id is correct")
        });
  }
}

export const editVouchers = (ids, values, targetCompany, bank) => {
  return async (dispatch, getState) => {
    const data = getState().rows;
    const vouchers = data.filter(item => ids.includes(item.id));

    remoteCall('tally:command:vouchers:modify', {targetCompany, vouchers, bank, values})
        .then((response) => {
          console.log(response);
          // dispatch(editRows(ids, values));
        })
        .catch((error) => {
          alert("Error modifying vouchers. Make sure master Id is correct")
        });
  }
}