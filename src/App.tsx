import { useState } from "react";
import "./App.css";
import { MainContext } from "./context";
import { MyComponent, MyComponent2 } from "./components";
import { getService, authenticate} from './api/services'
function App() {

  const [state, setState] = useState<any>({});
  const [user, setUser] = useState<any>({});

  return (
    <MainContext.Provider
      value={{
        state,
        setState,
        user,
        setUser,
        getService,
        authenticate
      }}
    >
      <div className="App">
        <MyComponent />
        <MyComponent2/>
      </div>
    </MainContext.Provider>
  );
}

export default App;
