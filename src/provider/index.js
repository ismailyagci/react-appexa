import React, { useEffect, useState } from "react";
import { StoreProvider } from "../store";
import container from "../container";

const Provider = ({ children, storeModules, config }) => {
  const [appReady, setAppReady] = useState(false);

  useEffect(() => {
    container.set("config", config);
    container.onChange((key) => {
      if (key === "requestMethodsCreated") {
        setAppReady(true)
      }
    });
  }, []);

  return <React.Fragment>
    <StoreProvider
      modules={storeModules}
    >
      {appReady ? children : null}
    </StoreProvider>
  </React.Fragment >
};

export default Provider;