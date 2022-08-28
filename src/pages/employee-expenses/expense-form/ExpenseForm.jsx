import { addDoc, collection, doc, setDoc, Timestamp } from "firebase/firestore";
import { useState } from "react";
import { database } from "../../../firebase";
import { BeatLoader } from "react-spinners";
import "./expenseForm.scss";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectExpenses } from "../../../redux/expenseSlice";

const initialState = {
  amount: "",
  status: "New",
  merchant: "",
  comment: "",
};

export default function ExpenseForm({ form, setForm }) {
  const { id } = useParams();
  const getExpense = useSelector(selectExpenses);
  const expenseEdit = getExpense?.find((xp) => xp.id === id);
  const [expense, setExpense] = useState(() => {
    const newState = detectForm(id, initialState, expenseEdit);
    return newState;
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setExpense({ ...expense, [name]: value });
  };

  function detectForm(id, arg1, arg2) {
    if (id === "ADD") {
      return arg1;
    } else {
      return arg2;
    }
  }

  const submitExpense = async (e) => {
    e.preventDefault();

    setLoading(true);
    try {
      const docReference = collection(database, "expenses");
      const today = new Date();
      const date = today.toLocaleDateString();
      const expenseConfig = {
        amount: Number(expense.amount),
        status: expense.status,
        merchant: expense.merchant,
        comment: expense.comment,
        addedAt: date,
        createdAt: Timestamp.now().toDate(),
      };
      await addDoc(docReference, expenseConfig);
      setLoading(false);
      navigate(-1);
    } catch (error) {
      alert(error.message);
    }
  };

  const editExpense = async (e) => {
    e.preventDefault();

    setLoading(true);

    const today = new Date();
    const date = today.toLocaleDateString();
    try {
      const docReference = doc(database, "expenses", id);
      await setDoc(docReference, {
        amount: Number(expense.amount),
        status: expense.status,
        merchant: expense.merchant,
        comment: expense.comment,
        addedAt: expenseEdit.addedAt,
        editedAt: date,
        createdAt: Timestamp.now().toDate(),
      });
      setLoading(false);
      navigate(-1);
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <>
      <div
        className={form ? "overlay reveal" : "overlay"}
        onClick={() => setForm(false)}
      />
      <div className={form ? "add__expense reveal" : "add__expense"}>
        <div className="add__expense__contents">
          <h2>{detectForm(id, "Add New Expense", "Edit Expense")}</h2>
          <form onSubmit={detectForm(id, submitExpense, editExpense)}>
            <label>
              <span>Expense Amount:</span>
              <input
                type="text"
                name="amount"
                value={expense.amount}
                onChange={(e) => handleInputChange(e)}
                required
                placeholder="Expense amount/price"
              />
            </label>
            <label>
              <span>Merchant:</span>
              <input
                type="text"
                name="merchant"
                value={expense.merchant}
                onChange={(e) => handleInputChange(e)}
                required
                placeholder="Enter Merchant for this expense"
              />
            </label>
            <label>
              <span>Expense Status:</span>
              <select
                name="status"
                value={expense.status}
                onChange={(e) => handleInputChange(e)}
                required
              >
                <option value="New">New</option>
                <option value="In Progress">In Progress</option>
                <option value="Reimbursed">Reimbursed</option>
              </select>
            </label>
            <label>
              <span>Comment on Expense:</span>
              <textarea
                type="text"
                name="comment"
                value={expense.comment}
                onChange={(e) => handleInputChange(e)}
                required
                placeholder="What is the expense for?"
                cols=""
                rows="3"
              />
            </label>
            <div className="buttons">
              {loading ? (
                <button type="button" disabled>
                  <BeatLoader loading={loading} size={10} color={"#fff"} />
                </button>
              ) : (
                <button type="submit">
                  {detectForm(id, "SUBMIT EXPENSE", "EDIT EXPENSE")}
                </button>
              )}
              <button
                onClick={() => navigate(-1)}
                type="button"
                className="cancel__btn"
              >
                CANCEL
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
