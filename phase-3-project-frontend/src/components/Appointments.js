import React, { useState, useEffect } from "react";
import AppointmentCard from "./AppointmentCard";

function Appointments({ dogs, walkers }) {
  const [appointments, setAppointments] = useState([]);

  const [walkerId, setWalkerId] = useState(1);
  const [dogId, setDogId] = useState(1);
  const [date, setDate] = useState("");

  useEffect(() => {
    fetch("http://localhost:9292/appointments")
      .then((res) => res.json())
      .then((data) => setAppointments(data));
  }, []);

  function onDeleteAppointment(appointmentId) {
    setAppointments((appointments) =>
      appointments.filter((appointment) => appointment.id !== appointmentId)
    );
  }

  const renderAppointments = appointments.map((appointment) => {
    return (
      <AppointmentCard
        {...appointment}
        key={appointment.id}
        onDeleteAppointment={onDeleteAppointment}
      />
    );
  });

  function addNewAppointment(newAppointment) {
    setAppointments(
      [...appointments, newAppointment].sort(
        (a, b) => new Date(a.date) - new Date(b.date)
      )
    );
  }

  function handleSubmit(e) {
    e.preventDefault();
    const newAppointment = {
      walker_id: parseInt(walkerId),
      dog_id: parseInt(dogId),
      date: date,
    };
    console.log(newAppointment);
    fetch("http://localhost:9292/appointments", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newAppointment),
    })
      .then((res) => res.json())
      .then((data) => addNewAppointment(data[0]));

    setDate("");
  }

  return (
    <div>
      <div className="form">
        <h2>Make An Appointment</h2>
        <form onSubmit={handleSubmit}>
          <label className="updateLabel">Choose a Walker</label>
          <select onChange={(e) => setWalkerId(e.target.value)}>
            {walkers.map((walker) => {
              return (
                <option key={walker.id} value={walker.id}>
                  {walker.name}
                </option>
              );
            })}
          </select>
          <label className="updateLabel">Choose a Dog</label>
          <select onChange={(e) => setDogId(e.target.value)}>
            {dogs.map((dog) => {
              return (
                <option key={dog.id} value={dog.id}>
                  {dog.name}
                </option>
              );
            })}
          </select>
          <input
            value={date}
            onChange={(e) => setDate(e.target.value)}
            type="date"
            name="date"
            placeholder="Date"
          />
          <button id="submit_button" type="submit">
            Create Appointment
          </button>
        </form>
      </div>
      <div className="appt-list">{renderAppointments}</div>
    </div>
  );
}

export default Appointments;
