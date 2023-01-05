import {debug} from "../components/config/debugEnabled";
import {useCallback, useContext, useEffect, useMemo, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import Select from "react-select";
import {remoteCall, remoteMonitorStart, remoteMonitorStop} from "../communication/electron";
import {setServer, setStatus, setLedgers, setResponseIds} from "./state/tallyActions";
import TallySubmitBar from "./TallySubmitBar/TallySubmitBar";
import Connection from "./ConnectionStatus/Connection";
import {setCompanies, setCurrentCompany, setTargetCompany} from "./state/tallyActions";
import AppContext from "../AppContext";

export const TallyMain = ({children}) => {
  if (debug.lifecycle) {
    console.log(`Rendering <TallyMain>`);
  }

  useEffect(() => {
    if (debug.lifecycle) {
      console.log(`<TallyMain>: First render`);
    }

    remoteCall('tally:server:get', {})
        .then((config) => {
          console.log(`config=${JSON.stringify(config)}`);
          dispatch(setServer(config));
        });

    return () => {
      if (debug.lifecycle) {
        console.log(`<TallyMain>: Destroyed`);
      }
    }
  }, []);

  const {
    data,
    onDataChange: updateData,
    onLedgersChange: updateLedgers
  } = useContext(AppContext);

  const boxShadow = "rgba(0, 0, 0, 0.05) 0px 6px 24px 0px, rgba(0, 0, 0, 0.08) 0px 0px 0px 1px";
  const dispatch = useDispatch();
  const serverAddr = useSelector((state) => state.tally.serverAddr);
  const tallyStatus = useSelector((state) => state.tally.status);
  const tallyCompanies = useSelector((state) => state.tally.companies);
  const tallyCurrentCompany = useSelector((state) => state.tally.currentCompany);
  const tallyTargetCompany = useSelector((state) => state.tally.targetCompany);
  const tallyLedgers = useSelector((state) => state.tally.ledgers);
  const responseIds = useSelector((state) => state.tally.responseIds);

  const [banksLedgers, setBankLedgers] = useState([]);

  const bankOptions = useMemo(() => {
    return banksLedgers.map((ledger) => {return {label: ledger.name, value: ledger.name}});
  }, [banksLedgers])

  const [currentBank, setCurrentBank] = useState('');


  const tallyDebug = true;
  const channelServerHealth = 'tally:server:status:health';

  const setServerSuccess = useCallback(() => {
    const channelStatus = 'tally:server:status';
    remoteCall(channelStatus)
        .then(status => {
          if (tallyDebug) {
            console.log(`${channelStatus}=${status}`);
          }
          dispatch(setStatus(status));
        })
        .catch(error => {
          console.log(`TallyServerStatus:useEffect[] error=${error}`);
        });


    remoteMonitorStart(channelServerHealth, (event, status) => {
      dispatch(setStatus(status));
    });
  }, []);


  // dep: serverAddr
  useEffect(() => {
    console.log(`TallyMain: useEffect[${JSON.stringify(serverAddr)}]`)
    if (serverAddr.host !== "") {
      const serverInit = 'tally:server:set';
      remoteCall(serverInit, {serverAddr})
          .then(response => {
            console.log(`serverInit: response=${response}`);
            setServerSuccess();
          })
          .catch(error => {
            console.error(`serverInit: error=${error}`);
          })
    }

    return () => {
      remoteMonitorStop(channelServerHealth, (event, response) => {
        console.log("Health Listener closed");
      });
    }
  }, [serverAddr]);

  // dep: tallyStatus
  useEffect(() => {
    if (tallyStatus) {
      console.log('The Tally Server is ON');
      remoteCall('tally:command:companies:list', {})
          .then(({request, response}) => {
            console.log(`useEffect[tallyStatus] companies=${JSON.stringify(response, null, 2)}`);
            dispatch(setCompanies(response));
          });

    }
  }, [tallyStatus])

  // dep: tallyCompanies
  useEffect(() => {
    if (tallyCompanies.length) {
      remoteCall('tally:command:companies:current', {})
          .then(({request, response}) => {
            console.log(`currentCompany: ${JSON.stringify(response.value, null, 2)}`);
            // setCurrentCompany(response);
            dispatch(setCurrentCompany(response.value));
          })
    }
  }, [tallyCompanies])

  // dep: tallyCurrentCompany
  useEffect(() => {
    dispatch(setTargetCompany(tallyCurrentCompany))
  }, [tallyCurrentCompany]);

  // dep: tallyCurrentCompany
  useEffect(() => {
    // console.log(`Need to get the ledgers`);
    if (tallyTargetCompany !== '') {
      remoteCall('tally:command:ledgers:list', {tallyTargetCompany})
          .then(({request, response}) => {
            // console.log('ledgers:', JSON.stringify(response));
            dispatch(setLedgers(response));
            // console.log(`Updated ledgers request=${request}`);
          })
          .catch(error => {
            console.log(`useEffect[tallyStatus]: error=${error}`);
          });
    }
  }, [tallyTargetCompany]);

  useEffect(() => {
    if (updateLedgers) {
      updateLedgers(tallyLedgers);
    }
    setBankLedgers(tallyLedgers.filter(ledger => ledger.parent === "Bank Accounts"));
  }, [tallyLedgers]);

  const deleteVouchers = useCallback((data, ids, targetCompany) => {
      const vouchers = data.filter(item => ids.includes(item.id));

      remoteCall('tally:command:vouchers:delete', {targetCompany, vouchers})
          .then((response) => {
            console.log(response);
            // dispatch(deleteRows(ids));
          })
          .catch((error) => {
            alert("Error deleting vouchers. Make sure master Id is correct")
          });
  }, []);

  const modifyVouchers = useCallback((data, ids, values, targetCompany, bank) => {
    const vouchers = data.filter(item => ids.includes(item.id));

    remoteCall('tally:command:vouchers:modify', {targetCompany, vouchers, bank, values})
        .then((response) => {
          console.log(response);
          // dispatch(editRows(ids, values));
        })
        .catch((error) => {
          alert("Error modifying vouchers. Make sure master Id is correct")
        });
  }, []);

  const addVouchers = useCallback((data, bankLedger, targetCompany) => {
    remoteCall('tally:command:vouchers:add', {vouchers:data, bank:bankLedger, targetCompany})
        .then((response) => {
          // console.log(`handleResponse: response=${JSON.stringify(response, null, 2)}`);
          const resultIds = Object.fromEntries(response.map(res => [res.index, res.voucherId]));
          dispatch(setResponseIds(resultIds));
        })
        .catch(error => {
          alert(error.reason || error);
        });
  }, [])

  const handleSubmit = useCallback((data, bankLedger, targetCompany) => {
    // console.log(`handleSubmitClick: data=${JSON.stringify(data, null, 2)}`);
    addVouchers(data, bankLedger, targetCompany);
  }, []);

  useEffect(() => {
    const newData = data.map((item, index) => {
      return {
        ...item,
        voucherId: responseIds[index]
      }
    });

    if (updateData) {
      const update = {action: 'SET', payload: responseIds}
      updateData(newData, [update], "tally");
    }
  }, [responseIds]);

  return (
    <div
        style={{
          display:"flex", flexDirection:"column", alignItems:"center", gap: "10px", justifyContent:"flex-start",
          // border: "2px dashed red"
        }}
    >
      <div style={{
        marginTop: "40px",
        marginBottom: "10px",
        width: "90%",
        borderRadius: "4px",
        minHeight: "60vh",
        // border: "1px dashed blue",
        boxShadow
      }}
      >
        {children}
      </div>

      <div style={{
        height: "70px", width:"100%",
        position: "fixed", bottom: "0",
        boxShadow: "0 0 3px rgba(0,0,0,0.2)",
        display: "flex", flexDirection:"row", justifyContent:"space-between",
        background:"white"
      }}
      >
        <div style={{width:"30%"}}>
          <Connection title={"Tally Server"} status={tallyStatus} />
        </div>

        <div style={{
          minWidth:"200px",
          display: "flex", flexDirection:"column", alignItems: "flex-end"
        }}
        >
          <label>
            Bank
          </label>
          <div style={{width:"100%"}}>
          <Select
              menuPlacement="top"
              options={bankOptions}
              value={bankOptions.filter(opt => opt.value === currentBank)}
              onChange={opt => setCurrentBank(opt.value)}
          />
          </div>
        </div>

        <div style={{width:"30%"}}>
          <TallySubmitBar
              disabled={false}
              onSubmit={e => handleSubmit(data, currentBank, tallyTargetCompany)}
          />
        </div>
      </div>
    </div>
  );
};
