import {debug} from "../components/config/debugEnabled";
import {useCallback, useEffect} from "react";
import {useDispatch, useSelector} from "react-redux";
import {remoteCall, remoteMonitorStart, remoteMonitorStop} from "../communication/electron";
import {setServer, setStatus} from "./state/tallyActions";
import TallySubmitBar from "./TallySubmitBar/TallySubmitBar";
import Connection from "./ConnectionStatus/Connection";

export const TallyMain = ({children, data}) => {
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

  const boxShadow = "rgba(0, 0, 0, 0.05) 0px 6px 24px 0px, rgba(0, 0, 0, 0.08) 0px 0px 0px 1px";
  const dispatch = useDispatch();
  const serverAddr = useSelector((state) => state.tally.serverAddr);
  const tallyStatus = useSelector((state) => state.tally.status);
  console.log(`serverAddr:${JSON.stringify(serverAddr)}`);

  const tallyDebug = true;
  const channelServerHealth = 'tally:server:status:health';

  const tallyServerSetup = useCallback(() => {
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
            tallyServerSetup();
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

  return (
    <div
        style={{
          display:"flex", flexDirection:"column", alignItems:"center", gap: "10px", justifyContent:"flex-start",
          border: "2px dashed red"

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
        border: "1px dashed blue",
        display: "flex", flexDirection:"row", justifyContent:"space-between"
      }}
      >
        <div style={{width:"30%"}}>
          <Connection title={"Tally Server"} status={tallyStatus} />
        </div>
        <div style={{width:"30%"}}>
          <TallySubmitBar data={data}/>
        </div>
      </div>
    </div>
  );
};
