// import './App.css';
import {BasicTable} from "./components/table/SimpleTable";
import {useMemo} from "react";
import MOCK_DATA from "./assets/MOCK_DATA.json";
import { MOCK_COLUMNS } from './assets/MOCK_COLUMNS';

function App() {
  console.log(`Rendering <App>`);
  const columns = useMemo(() => MOCK_COLUMNS, []);
  const data = useMemo(() => MOCK_DATA, []);

  const rtColumns = columns.map(col => {
    return {...col, id: col.key, Header: col.label, accessor: col.key}
  });

  return (
    <div className="App">
      <header className="App-header">
        <BasicTable data={data} columns={rtColumns}/>
      </header>
    </div>
  );
}

export default App;
