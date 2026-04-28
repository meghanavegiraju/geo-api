import React, { useEffect, useState } from "react";

function App() {
  const API_URL = "https://geo-api-11j8.onrender.com";
  const API_KEY = "16c24b72d7d478e6995cde4ec3388d7b"; // 🔴 replace with your key

  const headers = {
    "x-api-key": API_KEY
  };

  const [states, setStates] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [subdistricts, setSubdistricts] = useState([]);
  const [villages, setVillages] = useState([]);

  const [selectedState, setSelectedState] = useState("");
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [selectedSubdistrict, setSelectedSubdistrict] = useState("");
  const [selectedVillage, setSelectedVillage] = useState("");

  // 🔹 Load States
  useEffect(() => {
  fetch(`${API_URL}/states`, {
    headers: {
      "x-api-key": API_KEY
    }
  })
    .then(res => res.json())
    .then(data => {
      console.log("States:", data);
      setStates(Array.isArray(data) ? data : []);
    });
}, []);

  // 🔹 Load Districts
 useEffect(() => {
  if (!selectedState) return;

  fetch(`${API_URL}/districts?state=${selectedState}`, {
    headers: {
      "x-api-key": API_KEY
    }
  })
    .then(res => res.json())
    .then(data => setDistricts(Array.isArray(data) ? data : []));
}, [selectedState]);

  // 🔹 Load Subdistricts
  useEffect(() => {
  if (!selectedDistrict) return;

  fetch(`${API_URL}/subdistricts?district=${selectedDistrict}`, {
    headers: {
      "x-api-key": API_KEY
    }
  })
    .then(res => res.json())
    .then(data => setSubdistricts(Array.isArray(data) ? data : []));
}, [selectedDistrict]);

  // 🔹 Load Villages
  
  useEffect(() => {
  if (!selectedSubdistrict) return;

  fetch(`${API_URL}/villages?subdistrict=${selectedSubdistrict}`, {
    headers: {
      "x-api-key": API_KEY
    }
  })
    .then(res => res.json())
    .then(data => setVillages(Array.isArray(data) ? data : []));
}, [selectedSubdistrict]);

  return (
    <div style={{ padding: "20px" }}>
      <h2>Geo API Demo 🌍</h2>

      {/* 🔹 State */}
      <select
        value={selectedState}
        onChange={(e) => {
          setSelectedState(e.target.value);
          setDistricts([]);
          setSubdistricts([]);
          setVillages([]);
        }}
      >
        <option value="">Select State</option>
        {states.map((s, i) => (
          <option key={i} value={s.state}>
            {s.state}
          </option>
        ))}
      </select>

      {/* 🔹 District */}
      <select
        value={selectedDistrict}
        onChange={(e) => {
          setSelectedDistrict(e.target.value);
          setSubdistricts([]);
          setVillages([]);
        }}
      >
        <option value="">Select District</option>
        {districts.map((d, i) => (
          <option key={i} value={d.district}>
            {d.district}
          </option>
        ))}
      </select>

      {/* 🔹 Subdistrict */}
      <select
        value={selectedSubdistrict}
        onChange={(e) => {
          setSelectedSubdistrict(e.target.value);
          setVillages([]);
        }}
      >
        <option value="">Select Subdistrict</option>
        {subdistricts.map((s, i) => (
          <option key={i} value={s.subdistrict}>
            {s.subdistrict}
          </option>
        ))}
      </select>

      {/* 🔹 Village */}
      <select
        value={selectedVillage}
        onChange={(e) => setSelectedVillage(e.target.value)}
      >
        <option value="">Select Village</option>
        {villages.map((v, i) => (
          // <option key={i} value={v.address}>
          //   {v.address}
          // </option>
          <option key={i} value={v.fullAddress}>
  {v.village}
</option>
        ))}
      </select>

      <h3>Selected Address:</h3>
      <p>{selectedVillage}</p>
    </div>
  );
}

export default App;