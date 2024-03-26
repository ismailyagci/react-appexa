import React, { useEffect, useState } from "react";
import { StoreProvider } from "../store";
import container from "../container";

const Provider = ({ children, storeModules, config, isDevelopment }) => {
  const [appReady, setAppReady] = useState(false);

  useEffect(() => {
    container.onChange((key) => {
      if (key === "requestMethodsCreated") {
        setAppReady(true);
      }
    });
    container.set("isDevelopment", isDevelopment);
    container.set("config", config);
  }, []);

  return (
    <React.Fragment>
      <StoreProvider modules={storeModules}>
        {appReady ? children : null}
      </StoreProvider>
    </React.Fragment>
  );
};

export default Provider;
