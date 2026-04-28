import React, { useEffect, useState } from "react";

function App() {
  const API_URL = "https://geo-api-11j8.onrender.com";
  const API_KEY = "6aa256fd9d74009f1881e474757fe1df"; // 🔴 paste your key

  const [states, setStates] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [subdistricts, setSubdistricts] = useState([]);
  const [villages, setVillages] = useState([]);

  const [selectedState, setSelectedState] = useState("");
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [selectedSubdistrict, setSelectedSubdistrict] = useState("");
  const [selectedVillage, setSelectedVillage] = useState("");

  const headers = {
    "x-api-key": API_KEY
  };

  // Load states
  useEffect(() => {
  fetch(`${API_URL}/states`, {
    headers: {
      "x-api-key": API_KEY
    }
  })
    .then(res => res.json())
    .then(data => {
      console.log(data); // 👈 debug
      setStates(Array.isArray(data) ? data : []);
    });
}, []);

  // Load districts
  useEffect(() => {
    if (!selectedState) return;

    fetch(`${API_URL}/districts?state=${selectedState}`, { headers })
      .then(res => res.json())
      .then(data => setDistricts(data));
  }, [selectedState]);

  // Load subdistricts
  useEffect(() => {
    if (!selectedDistrict) return;

    fetch(`${API_URL}/subdistricts?district=${selectedDistrict}`, { headers })
      .then(res => res.json())
      .then(data => setSubdistricts(data));
  }, [selectedDistrict]);

  // Load villages
  useEffect(() => {
    if (!selectedSubdistrict) return;

    fetch(`${API_URL}/villages?subdistrict=${selectedSubdistrict}`, { headers })
      .then(res => res.json())
      .then(data => setVillages(data));
  }, [selectedSubdistrict]);

  return (
    <div style={{ padding: "20px" }}>
      <h2>Geo API Demo 🌍</h2>

      {/* State */}
      <select onChange={e => setSelectedState(e.target.value)}>
        <option>Select State</option>
        {states.map((s, i) => (
          <option key={i}>{s.state}</option>
        ))}
      </select>

      {/* District */}
      <select onChange={e => setSelectedDistrict(e.target.value)}>
        <option>Select District</option>
        {districts.map((d, i) => (
          <option key={i}>{d.district}</option>
        ))}
      </select>

      {/* Subdistrict */}
      <select onChange={e => setSelectedSubdistrict(e.target.value)}>
        <option>Select Subdistrict</option>
        {subdistricts.map((s, i) => (
          <option key={i}>{s.subdistrict}</option>
        ))}
      </select>

      {/* Village */}
      <select onChange={e => setSelectedVillage(e.target.value)}>
        <option>Select Village</option>
        {villages.map((v, i) => (
          <option key={i}>{v.address}</option>
        ))}
      </select>

      <h3>Selected Address:</h3>
      <p>{selectedVillage}</p>
    </div>
  );
}

export default App;