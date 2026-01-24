import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../services/api";
import BackButton from "../components/BackButton";

export default function TransactionDetails() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [transaction, setTransaction] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchTransaction = async () => {
            try {
                const res = await api.get(`/wallet/transactions/${id}`);
                setTransaction(res.data.data);
            } catch (err) {
                navigate("/transactions");
            } finally {
                setLoading(false);
            }
        };

        fetchTransaction();
    }, [id, navigate]);

    if (loading) {
        return <p className="text-center mt-10">Loading...</p>;
    }

    if (!transaction) {
        return <p className="text-center mt-10">Transaction not found</p>;
    }

    return (
        <div className="max-w-lg mx-auto mt-10 p-6 bg-white rounded shadow">
            <BackButton />

            <h2 className="text-xl font-bold mb-4">Transaction Details</h2>

            <p><strong>Reference:</strong> {transaction.reference}</p>
            <p><strong>Amount:</strong> ₦{transaction.amount}</p>
            <p><strong>Status:</strong> {transaction.status}</p>
            <p><strong>Type:</strong> {transaction.type}</p>
            <p><strong>Date:</strong> {new Date(transaction.createdAt).toLocaleString()}</p>
        </div>
    );
}


