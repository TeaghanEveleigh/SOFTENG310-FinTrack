import { useState, useContext } from "react";
import axios from "axios";
import TransactionForm from "./TransactionForm";
import TransactionContext from "../context/TransactionContext";

export default function AddTransactionButton() {
  const [showForm, setShowForm] = useState(false);
  const { balance, setBalance } = useContext(TransactionContext);

  const handleFormSubmit = async ({
    title,
    amount,
    description,
    transactionType,
  }) => {
    const token = localStorage.getItem("token");

    if (!token) {
      console.error("User is not authenticated.");
      return;
    }

    const axiosInstance = axios.create({
      baseURL: "http://localhost:4000",
      headers: { Authorization: `Bearer ${token}` },
    });

    console.log("amount: ", amount);

    try {
      // Post request to create the transaction
      const response = await axiosInstance.post("/transaction", {
        title,
        amount,
        description,
      });

      console.log("Transaction created successfully.", response.data);

      // Update the balance after the transaction is created

      // PATCH request to update the balance
      await axiosInstance.patch("/user/balance", { balance: balance + amount });

      console.log("Balance updated successfully.");
      setBalance(balance + amount); // Update the balance state in the context
    } catch (error) {
      console.error("Error occurred:", error);
    } finally {
      setShowForm(false);
    }
  };

  return (
    <>
      <button
        className="bg-primary-purple text-white text-button px-3 py-3 min-w-[280px] rounded-full hover:bg-primary-purple-dark active:bg-primary-pruple-darker"
        onClick={() => setShowForm(true)}
      >
        Add Transaction
      </button>
      {showForm && (
        <TransactionForm
          onSubmit={handleFormSubmit}
          onCancel={() => setShowForm(false)}
        />
      )}
    </>
  );
}
