import { createContext, useContext, useState } from "react";

const DashboardContext = createContext();

export const useDashboardContext = () => {
  return useContext(DashboardContext);
};

export const DashboardProvider = ({ children }) => {
  const [currentTemperature, setCurrentTemperature] = useState(0);
  const [currentHumidity, setCurrentHumidity] = useState(0);
  const [currentLight, setCurrentLight] = useState(0);
  const [led1On, setLed1On] = useState(false);
  const [led2On, setLed2On] = useState(false);

  const toggleLed1 = () => {
    setLed1On(!led1On);
  };

  const toggleLed2 = () => {
    setLed2On(!led2On);
  };

  return (
    <DashboardContext.Provider
      value={{
        currentTemperature,
        setCurrentTemperature,
        currentHumidity,
        setCurrentHumidity,
        currentLight,
        setCurrentLight,
        led1On,
        toggleLed1,
        led2On,
        toggleLed2,
      }}
    >
      {children}
    </DashboardContext.Provider>
  );
};
