import React, { useEffect, useState } from "react";
import Navbar from "./navbar/Navbar";
import AddEmployee from "./add-employee/AddEmployee";
import { AiOutlinePlus } from "react-icons/ai";
import { FaTrashAlt } from "react-icons/fa";
import { BsEyeFill } from "react-icons/bs";
import "./home.scss";
import useFetchCollection from "../../hooks/useFetchCollection";
import { ClipLoader } from "react-spinners";
import { database, storage } from "../../firebase";
import { deleteDoc, doc } from "firebase/firestore";
import { deleteObject, ref } from "firebase/storage";
import Notiflix from "notiflix";
import { Link, useNavigate } from "react-router-dom";
import EmployeeDetails from "./employee-details/EmployeeDetails";

export default function Home() {
  const [form, setForm] = useState(false);
  const [employees, setEmployees] = useState([]);
  const [details, setDetails] = useState(false);
  const { data, loading } = useFetchCollection("employees");
  const navigate = useNavigate();

  useEffect(() => {
    setEmployees(data);
  }, [data]);

  const handleFormVisibility = () => {
    setForm(true);
  };

  const handleShowDetails = (id, name) => {
    setDetails(true);
    navigate(`/employee/${name}/${id}`);
  };

  if (loading) {
    return (
      <div className="loader">
        {loading && (
          <ClipLoader
            color={"rgba(14, 16, 30, 0.937)"}
            loading={loading}
            size={50}
          />
        )}
      </div>
    );
  }

  const deleteEmployee = async (id, imagesUrl) => {
    try {
      await deleteDoc(doc(database, "employees", id));
      const storageRef = ref(storage, imagesUrl);
      await deleteObject(storageRef)
        .then(() => {
          "";
        })
        .catch((error) => {
          window.alert(error.message);
        });
    } catch (error) {
      if (error.message === "Missing or insufficient permissions.") {
        window.alert(
          "Missing or insufficient permissions. Contact the developer of this application"
        );
      }
    }
  };

  const confirmDelete = (id, name, imageUrl) => {
    Notiflix.Confirm.show(
      "Remove Employee",
      `Are you sure you want to remove ${name} from the employees directory?`,
      "DELETE",
      "CANCEL",
      function okCb() {
        deleteEmployee(id, imageUrl);
        window.alert(` ${name} has been removed successfully`);
      },
      function cancelCb() {},
      {
        width: "320px",
        borderRadius: "5px",
        titleColor: "rgba(14, 16, 30, 0.937)",
        okButtonBackground: "rgba(14, 16, 30, 0.937)",
        cssAnimationStyle: "zoom",
      }
    );
  };

  return (
    <div className="home">
      <Navbar />
      <AddEmployee form={form} setForm={setForm} />
      <div className="add__icon" onClick={handleFormVisibility}>
        <AiOutlinePlus className="icon" />
      </div>
      <div className="employees__list">
        <div className="table">
          <table>
            <thead>
              <tr>
                <th>S/N</th>
                <th>Name</th>
                <th>Profile Picture</th>
                <th>Department</th>
                <th>Job Description</th>
                <th>Location</th>
                <th>Date Added</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {employees?.map((employee, index) => {
                const {
                  id,
                  name,
                  department,
                  imageUrl,
                  addedAt,
                  location,
                  description,
                } = employee;
                return (
                  <tr key={id}>
                    <td>{index + 1}</td>
                    <td>{name}</td>
                    <td className="image">
                      <img
                        src={imageUrl}
                        alt={name}
                        style={{ width: "100px" }}
                      />
                    </td>
                    <td>{department}</td>
                    <td>{description}</td>
                    <td>{location}</td>
                    <td>{addedAt}</td>
                    <td className="icons">
                      <BsEyeFill
                        size={20}
                        color="#000"
                        onClick={() => handleShowDetails(id, name)}
                      />
                      &nbsp;
                      <FaTrashAlt
                        size={18}
                        color="rgb(199, 55, 84)"
                        onClick={() => confirmDelete(id, name, imageUrl)}
                      />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
