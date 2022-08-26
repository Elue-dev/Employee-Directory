import React, { useEffect, useState } from "react";
import { BsArrowLeft } from "react-icons/bs";
import { useNavigate, useParams } from "react-router-dom";
import { ClipLoader } from "react-spinners";
import useFetchDocuments from "../../../hooks/useFetchDocument";
import "./employeeDetails.scss";

export default function EmployeeDetails() {
  const { id } = useParams();
  const [employee, setEmployee] = useState(null);
  const { document } = useFetchDocuments("employees", id);
  const navigate = useNavigate();

  useEffect(() => {
    setEmployee(document);
  }, [document]);

  if (!document) {
    return (
      <div className="loader">
        <ClipLoader
          color={"rgba(14, 16, 30, 0.937)"}
          loading={true}
          size={50}
        />
      </div>
    );
  }

  return (
    <div className="section">
      <div className="employee__details">
        <div className="employee__details__contents">
          <div onClick={() => navigate(-1)} className="go__back">
            <p>
              <BsArrowLeft />
            </p>
          </div>
          <h2>Employee Details</h2>
          <div className="content__det">
            <div className="image_w">
              <img src={employee?.imageUrl} alt={employee?.name} width={100} />
            </div>
            <div className="content">
              <p>
                <b>Name:</b>
                &nbsp;{employee?.name}
              </p>
              <p>
                <b>Department:</b>
                &nbsp;{employee?.department}
              </p>
              <p>
                <b>Job Description:</b>
                &nbsp;{employee?.description}
              </p>
              <p>
                <b>Location:</b>
                &nbsp;{employee?.location}
              </p>
              <p>
                <b>Date Added:</b>
                &nbsp;{employee?.addedAt}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
