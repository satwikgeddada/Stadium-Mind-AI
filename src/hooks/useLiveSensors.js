import { useState, useEffect } from 'react';
import initialData from '../data/stadium.json';

const getRandomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

const getStatus = (density) => {
  if (density < 50) return 'Normal';
  if (density < 80) return 'Busy';
  return 'Congested';
};

export const useLiveSensors = () => {
  const [rawData, setRawData] = useState(initialData);
  
  // Internal historical arrays to keep the charts animating
  const [history, setHistory] = useState({
    labels: ["14:00", "15:00", "16:00", "17:00", "18:00", "19:00", "20:00"],
    visitors: [50000, 52000, 54000, 56000, 57000, 58000, initialData.visitors],
    crowdDensity: [30, 45, 60, 75, 82, 85, Math.round((initialData.gateA + initialData.gateB + initialData.gateC) / 3)],
    queueLength: [5, 12, 18, 35, 25, 20, 15],
    medicalRequests: [0, 1, 3, 2, 5, 4, initialData.medicalAlerts || 2],
    securityAlerts: [0, 0, 1, 3, 2, 1, initialData.securityAlerts || 1]
  });

  useEffect(() => {
    // Simulate live data fluctuations
    const interval = setInterval(() => {
      setRawData(prev => {
        const newVisitors = Math.max(0, prev.visitors + getRandomInt(-10, 35));
        const newGateA = Math.min(100, Math.max(0, prev.gateA + getRandomInt(-5, 5)));
        const newGateB = Math.min(100, Math.max(0, prev.gateB + getRandomInt(-5, 5)));
        const newGateC = Math.min(100, Math.max(0, prev.gateC + getRandomInt(-5, 5)));
        const newFoodCourt = Math.min(100, Math.max(0, prev.foodCourt + getRandomInt(-5, 5)));
        const newParking = Math.min(100, Math.max(0, prev.parking + getRandomInt(-5, 5)));
        
        return {
          ...prev,
          visitors: newVisitors,
          gateA: newGateA,
          gateB: newGateB,
          gateC: newGateC,
          foodCourt: newFoodCourt,
          parking: newParking,
        };
      });
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    // Update chart ends with new data
    setHistory(prev => {
      const avgDensity = Math.round((rawData.gateA + rawData.gateB + rawData.gateC) / 3);
      
      const newVisitors = [...prev.visitors];
      newVisitors[newVisitors.length - 1] = rawData.visitors;
      
      const newDensity = [...prev.crowdDensity];
      newDensity[newDensity.length - 1] = avgDensity;
      
      return {
        ...prev,
        visitors: newVisitors,
        crowdDensity: newDensity
      };
    });
  }, [rawData]);

  // Calculate composite metrics
  const avgDensity = Math.round((rawData.gateA + rawData.gateB + rawData.gateC) / 3);

  // Map flat stadium.json into the rich UI structure
  return {
    stats: {
      totalVisitors: rawData.visitors,
      weather: rawData.weather,
      queueLength: "15 mins",
      securityAlerts: rawData.securityAlerts,
      crowdDensity: avgDensity,
      medicalTeams: rawData.medicalAlerts,
      volunteersAvailable: rawData.volunteersAvailable
    },
    heatmap: [
      { name: "Gate A", status: getStatus(rawData.gateA) },
      { name: "Gate B", status: getStatus(rawData.gateB) },
      { name: "Gate C", status: getStatus(rawData.gateC) },
      { name: "Food Court", status: getStatus(rawData.foodCourt) },
      { name: "Parking", status: getStatus(rawData.parking) },
      { name: "Medical", status: "Normal" }
    ],
    hourlyTraffic: {
      labels: history.labels,
      data: history.visitors
    },
    analytics: history
  };
};
