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
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  FILTER_BY_DEPARTMENT,
  FILTER_BY_NAME,
  selectFilteredEmployees,
} from "../../redux/filterSlice";
import Info from "./info/Info";
import { useAuth } from "../../context/AuthContext";

export default function Home() {
  const [form, setForm] = useState(false);
  const [info, setInfo] = useState(false);
  const [employees, setEmployees] = useState([]);
  const [search, setSearch] = useState("");
  const [depts, setDepts] = useState("All");
  const { data, loading } = useFetchCollection("employees");
  const { user } = useAuth();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const filteredEmployees = useSelector(selectFilteredEmployees);

  const departments = [
    "All",
    ...new Set(employees.map((employee) => employee.department)),
  ];

  // let employeesArray = [];
  // if (depts === "All") {
  //   employeesArray = employees;
  // } else if (search !== "") {
  //   employeesArray = employees;
  // } else {
  //   employeesArray = filteredEmployees;
  // }

  useEffect(() => {
    setEmployees(data);
  }, [data]);

  useEffect(() => {
    dispatch(
      FILTER_BY_NAME({
        employees,
        search,
      })
    );
  }, [dispatch, employees, search]);

  const filterByDepartment = (dept) => {
    setDepts(dept);
    setSearch("");
    dispatch(FILTER_BY_DEPARTMENT({ employees, departments: dept }));
  };

  const handleShowDetails = (id, name) => {
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
      <Navbar setInfo={setInfo} />
      <AddEmployee form={form} setForm={setForm} />
      <Info info={info} setInfo={setInfo} />
      <div className="add__icon" onClick={() => setForm(!form)}>
        <AiOutlinePlus className="icon" />
      </div>
      <p className="welcome">Welcome, {user.displayName}!</p>
      <div className="employees__list">
        <label className="label">
          <input
            type="search"
            className="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by Name or Location..."
          />
          {/* <button onClick={() => setSearch("")} className="clear__search">
            Clear Search
          </button> */}
        </label>
        <div className="departments">
          {departments.map((department, index) => (
            <li
              key={index}
              onClick={() => filterByDepartment(department)}
              className={depts === department ? "active" : null}
            >
              {department}
            </li>
          ))}
        </div>
        {search ? (
          <>
            <h3 className="search__results">
              Search results for{" "}
              <em style={{ color: "rgb(199, 55, 84)" }}>
                <b>"{search}"</b>
              </em>
            </h3>
          </>
        ) : null}
        {filteredEmployees.length === 0 ? (
          <>
            <h2 className="no__results">No employees match your search</h2>
          </>
        ) : (
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
                {filteredEmployees?.map((employee, index) => {
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
        )}
      </div>
    </div>
  );
}
