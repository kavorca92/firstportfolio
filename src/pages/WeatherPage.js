import React, { useState } from "react";

import Content from '../components/Content';
import WeatherApp from "../components/WeatherApp";

const WeatherPage = () => {

  
  return(
      <div>
        
          <Content>
          <WeatherApp/>
          </Content>
          
      </div>
  );
}


export default WeatherPage;