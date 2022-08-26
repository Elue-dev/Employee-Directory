import { useState, useEffect, useRef } from "react";
import { useAuth } from "../../../context/AuthContext";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { database, storage } from "../../../firebase";
import { addDoc, collection, Timestamp } from "firebase/firestore";
import "./addEmployee.scss";
import { useNavigate } from "react-router-dom";
import { BeatLoader } from "react-spinners";

const initialState = {
  name: "",
  imageUrl: "",
  description: "",
  location: "",
  department: "",
};

export default function AddEmployee({ form, setForm }) {
  const { user } = useAuth();
  const [employee, setEmployee] = useState(initialState);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const imageRef = useRef(null);
  const { navigate } = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEmployee({ ...employee, [name]: value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    const storageRef = ref(storage, `ExpenseManager/${Date.now()}${file.name}`);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setUploadProgress(progress);
      },
      (error) => {
        window.alert(error.message);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          setEmployee({ ...employee, imageUrl: downloadURL });
        });
      }
    );
  };

  const addEmployeeToDatabase = async (e) => {
    e.preventDefault();

    setLoading(true);
    setError(null);
    try {
      const docReference = collection(database, "employees");
      const today = new Date();
      const date = today.toDateString();
      const employeesConfig = {
        name: employee.name,
        imageUrl: employee.imageUrl,
        description: employee.description,
        location: employee.location,
        department: employee.department,
        addedAt: date,
        createdAt: Timestamp.now().toDate(),
      };
      await addDoc(docReference, employeesConfig);
      setLoading(false);
      setForm(false);
      setEmployee(initialState);
      setUploadProgress(0);
      navigate("");
    } catch (error) {
      setError(error.message);
    }
  };
  return (
    <section className={form ? "show__form" : null}>
      <div className="add__employee">
        <div className="add__employee__contents">
          <h2>ADD EMPLOYEE</h2>
          <form onSubmit={addEmployeeToDatabase}>
            <label>
              <span>Name:</span>
              <input
                type="text"
                name="name"
                value={employee.name}
                onChange={(e) => handleInputChange(e)}
                placeholder="e.g John Daniels"
                required
              />
            </label>
            <label>
              <span>Profile Picture:</span>
              {uploadProgress === 0 ? null : (
                <div className={"progress"}>
                  <div
                    className={"progress-bar"}
                    style={{ width: `${uploadProgress}%` }}
                  >
                    {uploadProgress < 100
                      ? `Uploading ${uploadProgress.toFixed(0)}%`
                      : `Upload Complete ${uploadProgress}%`}
                  </div>
                </div>
              )}
              <input
                type="file"
                accept="image/*"
                ref={imageRef}
                onChange={(e) => handleImageChange(e)}
                required
              />
            </label>
            <label>
              <span>Department:</span>
              <input
                type="text"
                name="department"
                value={employee.department}
                onChange={(e) => handleInputChange(e)}
                placeholder="e.g Human Resource"
                required
              />
            </label>
            <label>
              <span>Job Description:</span>
              <input
                type="text"
                name="description"
                value={employee.description}
                onChange={(e) => handleInputChange(e)}
                placeholder="e.g Chief Diversity Officer"
                required
              />
            </label>
            <label>
              <span>Location:</span>
              <input
                type="text"
                name="location"
                value={employee.location}
                onChange={(e) => handleInputChange(e)}
                placeholder="e.g Lagos"
                required
              />
            </label>
            <div className="buttons">
              {loading ? (
                <button type="button" disabled>
                  <BeatLoader loading={loading} size={10} color={"#fff"} />
                </button>
              ) : (
                <button type="submit">SUBMIT</button>
              )}
              <button
                onClick={() => setForm(false)}
                type="button"
                className="cancel__btn"
              >
                CANCEL
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}
