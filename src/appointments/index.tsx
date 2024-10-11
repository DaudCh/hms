import React, { useEffect, useState } from "react";
import axios from "axios";
import Appointment from "../appointment";

interface Doctor {
  id: string;
  name: string;
  specialty: string;
  diseases: string[];
}

// Define the Appointment interface
interface Appointment {
  id: number;
  doctorId: string;
  doctorName: string;
  specialization: string;
  disease: string;
  date: string;
  time: string;
}

const Appointments: React.FC = () => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);

  // Fetch the appointments from the API
  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const response = await axios.get("http://localhost:4000/appointments");
        setAppointments(response.data);
      } catch (error) {
        console.error("Error fetching appointments:", error);
      }
    };

    fetchAppointments();
  }, []);

  // Handle Delete Appointment
  const handleDeleteAppointment = async (id: number) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this appointment?");
    if (confirmDelete) {
      try {
        await axios.delete(`http://localhost:4000/appointments/${id}`);
        // Remove the deleted appointment from the state
        setAppointments(appointments.filter(appointment => appointment.id !== id));
        alert("Appointment deleted successfully");
      } catch (error) {
        console.error("Error deleting appointment:", error);
      }
    }
  };

  // Handle Edit Appointment - open modal with the selected appointment data
  const handleEditAppointment = (appointment: Appointment) => {
    setSelectedAppointment(appointment);
  };

  // Handle Save after editing the appointment
  const handleSaveAppointment = async (doctor: Doctor, date: string, time: string) => {
    if (selectedAppointment) {
      try {
        await axios.put(`http://localhost:4000/appointments/${selectedAppointment.id}`, {
          doctorId: selectedAppointment.doctorId,
          doctorName: doctor.name,
          specialization: doctor.specialty,
          disease: selectedAppointment.disease,
          date,
          time,
        });
        // Update the appointment in the state
        setAppointments(appointments.map((appt) =>
          appt.id === selectedAppointment.id
            ? { ...appt, doctorName: doctor.name, date, time }
            : appt
        ));
        alert("Appointment updated successfully!");
        setSelectedAppointment(null); // Close the modal
      } catch (error) {
        console.error("Error updating appointment:", error);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 pt-24">
      <h2 className="text-3xl text-center font-bold text-indigo-600 mb-8">
        Booked Appointments
      </h2>
      
      <div className="max-w-4xl mx-auto p-4">
        {appointments.length === 0 ? (
          <p className="text-center text-gray-600">No appointments booked yet.</p>
        ) : (
          appointments.map((appointment) => (
            <div
              key={appointment.id}
              className="bg-white shadow-lg p-4 mb-4 rounded-lg flex justify-between items-center"
            >
              <div>
                <h3 className="text-lg font-semibold">
                  Doctor: {appointment.doctorName}
                </h3>
                <p>Specialization: {appointment.specialization}</p>
                <p>Disease: {appointment.disease}</p>
                <p>Date: {appointment.date}</p>
                <p>Time: {appointment.time}</p>
              </div>
              <div className="flex space-x-4">
                {/* Edit button */}
                <button
                  className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-400"
                  onClick={() => handleEditAppointment(appointment)}
                >
                  Edit
                </button>
                {/* Delete button */}
                <button
                  className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-400"
                  onClick={() => handleDeleteAppointment(appointment.id)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Edit Appointment Modal */}
      {selectedAppointment && (
        <Appointment
          doctor={{
            id: selectedAppointment.doctorId,
            name: selectedAppointment.doctorName,
            specialty: selectedAppointment.specialization,
            diseases: [selectedAppointment.disease],
          }}
          onSubmit={handleSaveAppointment}
          onClose={() => setSelectedAppointment(null)} // Close modal
        />
      )}
    </div>
  );
};

export default Appointments;
