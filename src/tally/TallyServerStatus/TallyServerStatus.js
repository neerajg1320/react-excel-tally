import './style.css';
import Connection from "../ConnectionStatus/Connection";
import SingleSelect from "../SingleSelect/SingleSelect";
import Button from "react-bootstrap/Button";
import {useDispatch, useSelector} from "react-redux";
import {useCallback, useEffect, useState} from "react";
import {
  setCompanies,
  setCurrentCompany,
  setLedgers, setServer,
  setStatus,
  setTargetCompany
} from "../state/tallyActions";
import ConditionalTooltipButton from "../TooltipButton/ConditionalTooltipButton";
import {remoteCall, remoteMonitorStart, remoteMonitorStop} from "../../communication/electron";
import {listToOptions} from "../../utils/options";

function TallyServerStatus({ onLedgersChange }) {
  const [commandOptions, setCommandOptions] = useState([]);
  const [selectedCommand, setSelectedCommand] = useState('');

  const [companyOptions, setCompanyOptions] = useState([]);

  const tallyStatus = useSelector((state) => state.tally.status);
  const tallyDebug = useSelector((state) => state.tally.debug);
  const tallyCompanies = useSelector((state) => state.tally.companies);
  const tallyCurrentCompany = useSelector((state) => state.tally.currentCompany);
  const tallyTargetCompany = useSelector((state) => state.tally.targetCompany);
  const tallyLedgers = useSelector((state) => state.tally.ledgers);

  const dispatch = useDispatch();
  // const config = useSelector((state) => state.config);
  const serverAddr = useSelector((state) => state.tally.serverAddr);
  const channelServerHealth = 'tally:server:status:health';
  const config = {debug:false};

  // dep: []
  useEffect(() => {
    console.log(`TallyServerStatus: useEffect[]`);

    remoteCall('tally:ui:ready', {})
        .then((config) => {
          console.log(`config=${JSON.stringify(config)}`);
          dispatch(setServer(config));
        });
  }, [])

  const tallyServerSetup = () => {
    if (config.debug) {
      remoteCall('command:list', {})
          .then(commands => {
            setCommandOptions(listToOptions(commands, 'Command'));
          });
    }

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
  }

  // dep: serverAddr
  useEffect(() => {
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
      setCompanyOptions(listToOptions(tallyCompanies.map(company => company.name), "Company"));

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

  useEffect(() => {
    if (onLedgersChange) {
      onLedgersChange(tallyLedgers);
    }
  }, [tallyLedgers]);

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

  const handleTargetCompanyChange = (e) => {
    console.log(`e=${JSON.stringify(e, null, 2)}`)
    dispatch(setTargetCompany(e));
  }

  const handleUpdateClick = (e) => {
    console.log('selected command:', selectedCommand);
    if (tallyStatus) {
      remoteCall('tally:command', {command: selectedCommand, targetCompany: tallyTargetCompany})
          .then(({request, response}) => {
            console.log(`handleUpdateClick: request=${request} response=${JSON.stringify(response, null, 2)}`);
            if (request === "LEDGERS") {
              dispatch(setLedgers(response));
            } else if (request === "COMPANIES") {
              dispatch(setCompanies(response));
            }
          })
          .catch(error => {
            console.log(`handleUpdateClick: error=${error}`);
          });
    }
  }


  return (
    <div className="server-container">
      <div className="server-info-box">
        <div className="server-company-box">
          <span className="server-company-label">Company:{"  "}</span>
          <span className="server-company-name">{tallyCurrentCompany}</span>
          {/*<SingleSelect className="form-control" options={companyOptions} onChange={handleTargetCompanyChange} value={tallyTargetCompany}/>*/}
        </div>
        {
          config.debug &&
            (<div className="server-command-box">
              <SingleSelect options={commandOptions} onChange={setSelectedCommand}/>
              <div className="server-command-button">
                <ConditionalTooltipButton condition={!tallyStatus} message="No connection to Tally!">
                  <Button variant="outline-dark" onClick={handleUpdateClick}>Update</Button>
                </ConditionalTooltipButton>
              </div>
            </div>)
        }
      </div>

      <div className="server-status-box">
        <Connection title={"Tally Server"} status={tallyStatus}/>
      </div>
    </div>

  );
}

export default TallyServerStatus;