import { useEffect, useState } from "react";
import api  from "../services/api";
import { useNavigate } from "react-router-dom";

export default function Transactions() {
    const navigate = useNavigate();
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(1);
    const [type, setType] = useState("");
    const [sort, setSort] = useState("desc");
    const [totalPages, setTotalPages] = useState(1);

    const fetchTransactions = async () => {
        setLoading(true);
        try {
            const res = await api.get("/wallet/transactions", {
                params: { page, limit: 10, type, sort },
            });

            setTransactions(res.data.transactions);
            setTotalPages(res.data.totalPages);
        } catch {
            alert("Could not load transactions");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTransactions();
    }, [page, type, sort]);

    return (
        <div className="p-6">
            <h2 className="text-2xl font-bold mb-4">Transaction History</h2>

            {/* Filters */}
            <div className="flex gap-4 mb-4">
                <select
                    onChange={(e) => setType(e.target.value)}
                    className="border p-2 rounded"
                >
                    <option value="">All Types</option>
                    <option value="credit">Credit</option>
                    <option value="debit">Debit</option>
                </select>

                <select
                    onChange={(e) => setSort(e.target.value)}
                    className="border p-2 rounded"
                >
                    <option value="desc">Newest</option>
                    <option value="asc">Oldest</option>
                </select>
            </div>

            {/* Table */}
            <div className="bg-white shadow rounded overflow-hidden">
                <table className="w-full">
                    <thead className="bg-gray-100">
                        <tr>
                            <th className="p-3 text-left">Type</th>
                            <th className="p-3 text-left">Amount</th>
                            <th className="p-3 text-left">Reference</th>
                            <th className="p-3 text-left">Date</th>
                        </tr>
                    </thead>

                    <tbody>
                        {loading ? (
                            <tr>
                                <td colSpan="4" className="p-6 text-center">
                                    Loading...
                                </td>
                            </tr>
                        ) : transactions.length === 0 ? (
                            <tr>
                                <td colSpan="4" className="p-6 text-center">
                                    No transactions found
                                </td>
                            </tr>
                        ) : (
                            transactions.map((t) => (
                                <tr
                                    key={t._id}
                                    className="border-t cursor-pointer hover:bg-blue-50"
                                    onClick={() => navigate(`/transactions/${t._id}`)}
                                >
                                    <td className="p-3 capitalize">{t.type}</td>
                                    <td className="p-3">₦{t.amount}</td>
                                    <td className="p-3">{t.reference}</td>
                                    <td className="p-3">
                                        {new Date(t.createdAt).toLocaleString()}
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* Pagination */}
            <div className="mt-4 flex gap-3">
                <button
                    onClick={() => setPage((p) => Math.max(p - 1, 1))}
                    className="px-4 py-2 bg-gray-300 rounded"
                >
                    Prev
                </button>
                <span className="px-4 py-2">
                    Page {page} of {totalPages}
                </span>
                <button
                    onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
                    className="px-4 py-2 bg-gray-300 rounded"
                >
                    Next
                </button>
            </div>
        </div>
    );
}

