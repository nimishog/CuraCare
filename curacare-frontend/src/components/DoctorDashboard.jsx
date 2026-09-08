import { useState } from "react";
import "./DoctorDashboard.css";
import logo from "../assets/logo.png";

export default function DoctorDashboard({ onLogout }) {

  const [prescriptions, setPrescriptions] = useState([
    {
      medicine: "",
      dosage: "",
      timing: ""
    }
  ]);

  // UPDATE PRESCRIPTION FIELD
  const handleChange = (index, field, value) => {

    const updatedPrescriptions = [...prescriptions];

    updatedPrescriptions[index][field] = value;

    setPrescriptions(updatedPrescriptions);
  };


  // ADD NEW MEDICINE ROW
  const addMorePrescription = () => {

    setPrescriptions([
      ...prescriptions,
      {
        medicine: "",
        dosage: "",
        timing: ""
      }
    ]);
  };


  // REMOVE MEDICINE ROW
  const removePrescription = (index) => {

    if (prescriptions.length === 1) {
      return;
    }

    const updatedPrescriptions =
      prescriptions.filter((_, i) => i !== index);

    setPrescriptions(updatedPrescriptions);
  };


  // PRINT PRESCRIPTION
  const handlePrint = () => {

    window.print();
  };


  return (

    <div className="dashboard-page">


      {/* NAVBAR */}

      <div className="dashboard-navbar">

        <div className="dashboard-logo">

          <img
            src={logo}
            alt="CuraCare"
          />

          <span>CuraCare doc</span>

        </div>


        <div className="dashboard-nav-links">

          <span>Home</span>

          <span>History</span>

          <span>Appointments</span>

          <span>30 People in queue</span>

        </div>

      </div>


      {/* MAIN CONTENT */}

      <div className="dashboard-content">


        {/* LEFT SECTION */}

        <div className="patient-summary">

          <h3>Chief Complaint</h3>

          <p className="complaint">

            “Pet ke upar wale hisse mein 3 din se dard hai,
            khaana khane ke baad badh jaata hai.”

          </p>


          <h3>Symptoms Reported</h3>

          <ul>

            <li>Upper abdominal pain — Yes</li>

            <li>Pain severity — 7/10</li>

            <li>Vomiting — Yes, 2 episodes</li>

            <li>Nausea — Yes</li>

            <li>Fever — No</li>

            <li>Diarrhea — No</li>

            <li>Blood in stool/vomit — No</li>

            <li>Pain radiating to chest/back — No</li>

          </ul>


          <h3>Medical History</h3>

          <ul>

            <li>Diabetes — 5 years</li>

            <li>Hypertension — 3 years</li>

            <li>Previous similar episode — Yes, 1 year ago</li>

            <li>Previous surgery — No</li>

          </ul>


          <h3>Current Medications</h3>

          <ul>

            <li>Metformin 500 mg — Twice daily</li>

            <li>Amlodipine 5 mg — Once daily</li>

          </ul>


          <h3>Allergies</h3>

          <ul>

            <li>Penicillin — Patient reported</li>

          </ul>

        </div>


        {/* RIGHT SECTION */}

        <div className="doctor-right-section">


          {/* PATIENT DETAILS */}

          <div className="patient-card">


            <div className="patient-image">

              <img
                className="patient-img"

                src="https://thumbs.dreamstime.com/b/older-male-polo-shirt-10999843.jpg?w=768"

                alt="Patient"
              />

            </div>


            <div className="patient-info">

              <p>

                <b>Patient Name :</b> Abhinav Singh Negi

              </p>


              <p>

                <b>Date Of Birth :</b> 13/04/1960

              </p>


              <p>

                <b>Gender :</b> Male

              </p>


              <p>

                <b>Blood Group :</b> AB+

              </p>

            </div>

          </div>


          {/* PRESCRIPTION */}

          <div className="prescription-card">

            <h3>Make Prescription</h3>


            {/* TABLE HEADINGS */}

            <div className="prescription-header">

              <span>Medicine</span>

              <span>Dosage</span>

              <span>Timing</span>

              <span>Action</span>

            </div>


            {/* PRESCRIPTION ROWS */}

            <div className="prescription-list">

              {prescriptions.map((prescription, index) => (

                <div
                  className="prescription-row"
                  key={index}
                >


                  {/* MEDICINE */}

                  <input
                    type="text"

                    placeholder="Medicine Name"

                    value={prescription.medicine}

                    onChange={(e) =>
                      handleChange(
                        index,
                        "medicine",
                        e.target.value
                      )
                    }
                  />


                  {/* DOSAGE */}

                  <input
                    type="text"

                    placeholder="Dosage"

                    value={prescription.dosage}

                    onChange={(e) =>
                      handleChange(
                        index,
                        "dosage",
                        e.target.value
                      )
                    }
                  />


                  {/* TIMING */}

                  <input
                    type="text"

                    placeholder="Timing"

                    value={prescription.timing}

                    onChange={(e) =>
                      handleChange(
                        index,
                        "timing",
                        e.target.value
                      )
                    }
                  />


                  {/* REMOVE */}

                  <button
                    className="remove-button"

                    onClick={() =>
                      removePrescription(index)
                    }
                  >

                    Remove

                  </button>


                </div>

              ))}

            </div>


            {/* BUTTONS */}

            <div className="prescription-buttons">


              <button
                className="add-more-button"

                onClick={addMorePrescription}
              >

                Add More

              </button>


              <button
                className="print-button"

                onClick={handlePrint}
              >

                Print

              </button>


            </div>


          </div>


          {/* NEXT PATIENT */}

          <button className="next-patient">

            Next Patient

          </button>


        </div>


      </div>


    </div>
  );
}