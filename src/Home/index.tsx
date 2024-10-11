import React, { useState, useEffect } from "react";
import axios from "axios";
import Appointment from "../appointment";

// Define the Doctor interface
interface Doctor {
  id: string;
  name: string;
  specialty: string;
  diseases: string[];
}

const Home: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState<string>(""); // Type explicitly as string
  const [filteredDoctors, setFilteredDoctors] = useState<Doctor[]>([]); // Use Doctor[] for array of doctors
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null); // Doctor or null
  const [doctors, setDoctors] = useState<Doctor[]>([]);

  // Carousel state
  const [activeIndex, setActiveIndex] = useState<number>(0); // Index of current slide
  const images = [
    "/images/irwan-rbDE93-0hHs-unsplash.jpg",
    "/images/marcelo-leal-6pcGTJDuf6M-unsplash.jpg",
    "/images/hms.jpg",
  ];

  // Automatically change the active slide every 3 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 3000); // Change every 3 seconds

    return () => clearInterval(interval); // Clear interval on component unmount
  }, [images.length]);

  // Fetch doctors from API
  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const response = await axios.get("http://localhost:4000/doctors");
        setDoctors(response.data);
      } catch (error) {
        console.error("Error fetching doctors:", error);
      }
    };
    fetchDoctors();
  }, []);

  const handleSearch = () => {
    const filtered = doctors.filter((doctor) =>
      doctor.diseases.some((disease: string) =>
        disease.toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
    setFilteredDoctors(filtered);
  };

  const handleBookAppointment = async (doctor: Doctor, date: string, time: string) => {
    const appointment = {
      doctorId: doctor.id,
      doctorName: doctor.name,
      specialization: doctor.specialty,
      date,
      time,
    };

    try {
      await axios.post("http://localhost:4000/appointments", appointment);
      alert("Appointment booked successfully!");
      setSelectedDoctor(null); // Close the appointment modal after successful booking
    } catch (error) {
      console.error("Error booking appointment:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Full-screen Carousel Section */}
      <div className="relative h-screen w-full overflow-hidden">
        <div
          className="absolute top-0 left-0 w-full h-full flex transition-transform duration-1000"
          style={{ transform: `translateX(-${activeIndex * 100}%)` }}
        >
          {images.map((image, index) => (
            <div key={index} className="w-full h-full flex-shrink-0">
              <img
                src={image}
                alt={`Slide ${index + 1}`}
                className="w-full h-full object-cover"
              />
            </div>
          ))}
        </div>

        {/* Carousel Overlay Text */}
        <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
          <h1 className="text-white text-5xl font-bold shadow-lg">Hospital Management System</h1>
        </div>

        {/* Dots for Carousel */}
        <div className="absolute bottom-6 w-full flex justify-center">
          {images.map((_, idx) => (
            <div
              key={idx}
              className={`w-4 h-4 mx-2 rounded-full cursor-pointer ${
                activeIndex === idx ? "bg-white" : "bg-gray-400"
              }`}
              onClick={() => setActiveIndex(idx)}
            />
          ))}
        </div>
      </div>

      {/* Book Appointment Section */}
      <div className="flex flex-col items-center mt-10">
        <h2 className="text-4xl font-semibold text-gray-800">Book Appointment</h2>
        <div className="mt-6 w-full max-w-lg flex justify-center">
          <input
            type="text"
            placeholder="Search by disease..."
            className="w-3/4 px-4 py-3 border rounded-l-md text-lg focus:outline-none focus:ring-2 focus:ring-indigo-600"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button
            className="bg-indigo-600 text-white px-6 py-3 text-lg rounded-r-md hover:bg-indigo-500 transition duration-300"
            onClick={handleSearch}
          >
            Search
          </button>
        </div>
      </div>

      {/* Doctor List */}
      <div className="mt-10 px-8">
        {filteredDoctors.length > 0 ? (
          filteredDoctors.map((doctor) => (
            <div
              key={doctor.id}
              className="p-6 bg-white shadow-md rounded-lg mb-6 flex justify-between items-center hover:shadow-lg transition duration-300"
            >
              <div>
                <h3 className="text-xl font-bold text-gray-700">{doctor.name}</h3>
                <p className="text-gray-500">{doctor.specialty}</p>
              </div>
              <button
                className="bg-indigo-600 text-white px-6 py-3 rounded-md hover:bg-indigo-500 transition duration-300"
                onClick={() => setSelectedDoctor(doctor)}
              >
                Book Appointment
              </button>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-500 text-lg">No doctors found for this disease.</p>
        )}
      </div>

      {/* Appointment Modal */}
      {selectedDoctor && (
        <Appointment
          doctor={selectedDoctor}
          onClose={() => setSelectedDoctor(null)} // Close modal
          onSubmit={handleBookAppointment}
        />
      )}
    </div>
  );
};

export default Home;
