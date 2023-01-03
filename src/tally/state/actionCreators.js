import {remoteCall} from "../../communication/electron";

export const addVouchers = (vouchers, targetCompany, bank) => {
  console.log(`targetCompany=${targetCompany}`);

  return async (dispatch, getState) => {
    remoteCall('tally:command:vouchers:add', {targetCompany, vouchers, bank})
        .then((response) => {
          // console.log(`handleResponse: response=${JSON.stringify(response, null, 2)}`);

          const resultMap = Object.fromEntries(response.map(res => [res.id, res.voucher_id]));
          // console.log(`resultMap=${JSON.stringify(resultMap)}`);

          // Add column for showing voucherId
          // const columns = getState().columns;
          // const tableVoucherCol = columns.filter(col => col.key === 'VoucherId');
          // if (tableVoucherCol.length < 1) {
          //   const voucherIdCol = presetColumns.filter(col => col.key === 'VoucherId');
          //   if (voucherIdCol.length > 0) {
          //     // dispatch(addColumn(voucherIdCol[0]));
          //   }
          // }

          // Add voucherId
          // const data = getState().rows;
          // const newData = data.map(row => {
          //   // console.log(`row=${JSON.stringify(row, null, 2)}`);
          //   return {
          //     ...row,
          //     'VoucherId': resultMap[row.id]
          //   }
          // });
          // console.log(`Saved to Tally: newData=${JSON.stringify(newData, null, 2)}`)
          // dispatch(setRows(newData));

        })
        .catch(error => {
          alert("Error adding vouchers. Make sure Category is present in Tally")
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