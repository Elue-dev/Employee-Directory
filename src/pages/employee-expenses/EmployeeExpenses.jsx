import { deleteDoc, doc } from "firebase/firestore";
import Notiflix from "notiflix";
import { useEffect } from "react";
import { useState } from "react";
import { AiOutlinePlus } from "react-icons/ai";
import { BsEyeFill } from "react-icons/bs";
import { FaEdit, FaTrashAlt } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { ClipLoader } from "react-spinners";
import Navbar from "../../components/homepage/navbar/Navbar";
import { database } from "../../firebase";
import useFetchCollection from "../../hooks/useFetchCollection";
import { selectExpenses, STORE_EXPENSES } from "../../redux/expenseSlice";
import {
  FILTER_BY_MERCHANT,
  selectFilteredExpenses,
  SORT_EXPENSES,
} from "../../redux/filterSlice";
import "./employeeExpenses.scss";

export default function EmployeeExpenses() {
  const { data, loading } = useFetchCollection("expenses");
  const [expenses, setExpenses] = useState([]);
  const [merchants, setMerchants] = useState("All");
  const [sort, setSort] = useState("Default");
  const [form, setForm] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const filteredExpenses = useSelector(selectFilteredExpenses);

  useEffect(() => {
    setExpenses(data);
  }, [data]);

  useEffect(() => {
    dispatch(
      STORE_EXPENSES({
        expenses: data,
      })
    );
  }, [dispatch, data]);

  const deleteExpense = async (id) => {
    try {
      await deleteDoc(doc(database, "expenses", id));
    } catch (error) {
      window.alert(error.message);
    }
  };

  const confirmDelete = (id) => {
    Notiflix.Confirm.show(
      "Remove Expense",
      `Are you sure you want to remove this Expense?`,
      "DELETE",
      "CANCEL",
      function okCb() {
        deleteExpense(id);
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

  const allMerchants = ["All", ...new Set(expenses.map((e) => e.merchant))];

  useEffect(() => {
    dispatch(
      FILTER_BY_MERCHANT({
        expenses,
        merchants,
      })
    );
  }, [dispatch, expenses, merchants]);

  useEffect(() => {
    dispatch(
      SORT_EXPENSES({
        expenses,
        sort,
      })
    );
  }, [dispatch, expenses, sort]);

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

  const handleSorting = (e) => {
    setSort(e.target.value);
    setMerchants("All");
  };

  const handleMerchants = (e) => {
    setMerchants(e.target.value);
    setSort("Default");
  };

  return (
    <div className="employee__expenses">
      <div className="add__icon">
        <Link to="/expense-form/ADD">
          <AiOutlinePlus className="icon" />
        </Link>
      </div>
      <Navbar />
      <h2 className="intro">Employee Expense Log</h2>
      <div className="expense__content">
        <fieldset>
          <legend>
            <h3>Filter / Sort Expenses</h3>
          </legend>

          <h3>Filter Expenses by Merchants</h3>
          <select value={merchants} onChange={handleMerchants}>
            {allMerchants.map((m) => (
              <option key={m}>{m}</option>
            ))}
          </select>
          <h3>Sort Expenses</h3>
          <select value={sort} onChange={handleSorting}>
            <option value="Default">Default</option>
            <option value="Lowest Total">Sort by Lowest Total</option>
            <option value="Highest Total">Sort by Highest Total</option>
            <option value="New">Status: New</option>
            <option value="Processing">Status: Processing</option>
            <option value="Reinbursed">Status: Reinbursed</option>
          </select>
        </fieldset>
        {filteredExpenses.length === 0 ? (
          <h2 className="no__results">
            No expenses found
          </h2>
        ) : (
          <div className="table">
            <table>
              <thead>
                <tr>
                  <th>S/N</th>
                  <th>Date</th>
                  <th>Employee Name</th>
                  <th>Merchant</th>
                  <th>Total</th>
                  <th>Status</th>
                  <th>Comment</th>
                  <th>Last Edited</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredExpenses?.map((expense, index) => {
                  const {
                    id,
                    addedAt,
                    employee_name,
                    merchant,
                    amount,
                    status,
                    comment,
                    editedAt,
                  } = expense;
                  return (
                    <tr key={id}>
                      <td>{index + 1}</td>
                      <td>{addedAt}</td>
                      <td>{employee_name}</td>
                      <td>{merchant}</td>
                      <td>${amount}</td>
                      <td
                        style={{
                          color:
                            status === "Reinbursed"
                              ? "green"
                              : status === "Processing"
                              ? "orange"
                              : "rgb(199, 55, 84)",
                          fontWeight: "600",
                        }}
                      >
                        {status}
                      </td>
                      <td>{comment}</td>
                      {editedAt ? <td>{editedAt}</td> : <td>No Edits Yet</td>}
                      <td className="icons">
                        <Link to={`/expense-form/${id}`}>
                          <FaEdit size={18} color="#111" />
                        </Link>
                        <FaTrashAlt
                          size={18}
                          color="rgb(199, 55, 84)"
                          onClick={() => confirmDelete(id)}
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
