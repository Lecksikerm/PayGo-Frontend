import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

export default function BackButton() {
    const navigate = useNavigate();
    return (
        <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-blue-600 hover:underline mb-3"
        >
            <ArrowLeft size={18} /> Back
        </button>
    );
}
