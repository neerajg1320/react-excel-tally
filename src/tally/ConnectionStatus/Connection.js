import './connection.css';
import {useState, useEffect} from "react";
import {AiFillSetting} from "react-icons/ai";
import Button from "react-bootstrap/Button";
import {useDispatch, useSelector} from "react-redux";
import {setServer} from "../state/tallyActions";

function Connection({title, status}) {
  const [active, setActive] = useState(false);
  const [host, setHost] = useState('');
  const [port, setPort] = useState('');
  const serverAddr = useSelector((state) => state.tally.serverAddr);
  const dispatch = useDispatch();

  const fillServerAddr = () => {
    setHost(serverAddr.host);
    setPort(serverAddr.port);
  }

  useEffect(() => {
    fillServerAddr();
  }, [serverAddr]);

  const handleSettingsClick = (e) => {
    setActive(!active);
  };

  const handleCancelClick = (e) => {
    setActive(!active);
    fillServerAddr();
  }

  const handleSaveClick = (e) => {
    setActive(!active);
    dispatch(setServer({host, port}));
  }

  return (
    <div className="connection-status-wrapper" style={{display:"flex", flexDirection:"column"}}>


      {/* Settings icon and container box */}
      <div style={{display: "flex", gap: "20px"}}>
        <div className="settings-container">
            <div className="settings-input-trigger">
              <span>Settings</span>
              <AiFillSetting size={24} onClick={handleSettingsClick}/>
            </div>
            <div className={`settings-input-box ${active ? "active" : "inactive"}`}>
              <div>
                <label>Server IP</label>
                <input
                    className="form-control settings-input-field"
                    type="text"
                    value={host}
                    onChange={(e) => setHost(e.target.value)}
                />
              </div>
              <div>
                <label>Server Port</label>
                <input
                    className="form-control settings-input-field"
                    // className=""
                    type="text"
                    value={port}
                    onChange={(e) => setPort(e.target.value)}
                />              </div>
              <div className="settings-buttons-container">
                <Button
                    className="bg-transparent  btn-outline-danger"
                    onClick={handleCancelClick}
                    size="sm"
                >
                  Cancel
                </Button>
                <Button
                    className="btn-primary"
                    onClick={handleSaveClick}
                    size="sm"
                >
                  Save
                </Button>
              </div>
            </div>
          </div>
      </div>

      <div className="connection-status-box">
        <span>{title} connection is {status ? "On" : "Off"}</span>
        {status ?
            <span className="connection-indicator connection-active"></span> :
            <span className="connection-indicator connection-inactive"></span>
        }
      </div>
    </div>
  );
}

export default Connection;
