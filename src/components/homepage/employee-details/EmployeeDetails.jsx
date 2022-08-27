import React, { useEffect, useState } from "react";
import { BsArrowLeft } from "react-icons/bs";
import { useNavigate, useParams } from "react-router-dom";
import { ClipLoader } from "react-spinners";
import useFetchCollection from "../../../hooks/useFetchCollection";
import useFetchDocuments from "../../../hooks/useFetchDocument";
import "./employeeDetails.scss";

export default function EmployeeDetails() {
  const { id } = useParams();
  const [employee, setEmployee] = useState(null);
  const [expenses, setExpenses] = useState(null);
  const { document } = useFetchDocuments("employees", id);
  const { data } = useFetchCollection("expenses");
  const navigate = useNavigate();
  const filteredExpenses = expenses?.filter(
    (ex) => ex.employee_name === employee?.name
  );

  useEffect(() => {
    setEmployee(document);
  }, [document]);

  useEffect(() => {
    setExpenses(data);
  }, [data]);

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
    // <div className="section">
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
            <br />
            <p className="e_expenses">
              <p className="e_title">Expenses by {employee?.name}</p>
              <>
                <>
                  {!filteredExpenses ? (
                    <>
                      {" "}
                      <span>
                        {employee?.name} has not made any expenses yet.
                      </span>
                    </>
                  ) : (
                    <>
                      {filteredExpenses.map((ex) => (
                        <div key={ex.id} className="ex_fil">
                          <p>
                            &rarr; <b style={{ paddingTop: "1rem" }}>Amount:</b>{" "}
                            ${ex?.amount}
                          </p>
                          <p>
                            <b>Expense Date:</b> {ex?.addedAt}
                          </p>
                          <p>
                            <b>Reason for Expense:</b> {ex?.comment}
                          </p>
                          <p>
                            <b
                             
                            >
                              Expense Status:
                            </b>{" "}
                            <span  style={{
                                color:
                                  ex?.status === "Reinbursed"
                                    ? "green"
                                    : ex?.status === "Processing"
                                    ? "orange"
                                    : "rgb(199, 55, 84)",
                                fontWeight: "600",
                              }}>{ex?.status}</span>
                          </p>
                          <hr className="hr" />
                        </div>
                      ))}
                    </>
                  )}
                </>
              </>
            </p>
          </div>
        </div>
      </div>
    </div>
    // </div>
  );
}
