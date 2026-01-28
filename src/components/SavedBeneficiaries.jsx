import React, { useState } from 'react';
import { FaUserCircle, FaTrash, FaEdit, FaTimes, FaCheck } from 'react-icons/fa';
import { useBeneficiaries } from '../hooks/useBeneficiaries';

export const SavedBeneficiaries = ({ onSelect, selectedEmail }) => {
    const { beneficiaries, loading, deleteBeneficiary, updateNickname } = useBeneficiaries();
    const [editingId, setEditingId] = useState(null);
    const [editNickname, setEditNickname] = useState('');
    const [showConfirmDelete, setShowConfirmDelete] = useState(null);

    if (loading) {
        return (
            <div className="mb-6 p-4 bg-gray-50 rounded-xl border border-gray-200 animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-1/3 mb-3"></div>
                <div className="flex gap-3">
                    <div className="h-20 w-40 bg-gray-200 rounded"></div>
                    <div className="h-20 w-40 bg-gray-200 rounded"></div>
                </div>
            </div>
        );
    }

    if (!beneficiaries.length) return null;

    const handleEdit = (beneficiary) => {
        setEditingId(beneficiary._id);
        setEditNickname(beneficiary.nickname || '');
    };

    const handleSaveNickname = async (id) => {
        await updateNickname(id, editNickname);
        setEditingId(null);
    };

    const handleDelete = async (id) => {
        await deleteBeneficiary(id);
        setShowConfirmDelete(null);
    };

    return (
        <div className="mb-6 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-5 border border-blue-100 shadow-sm">
            <div className="flex justify-between items-center mb-4">
                <div>
                    <h3 className="text-sm font-bold text-gray-800 flex items-center gap-2">
                        <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                        Saved Beneficiaries
                    </h3>
                    <p className="text-xs text-gray-500 mt-1">Click to auto-fill transfer details</p>
                </div>
                <span className="text-xs font-medium text-blue-600 bg-blue-100 px-2 py-1 rounded-full">
                    {beneficiaries.length} saved
                </span>
            </div>

            <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide snap-x">
                {beneficiaries.map((b) => (
                    <div
                        key={b._id}
                        className={`flex-shrink-0 relative group p-3 rounded-xl border-2 transition-all duration-200 min-w-[200px] snap-start
              ${selectedEmail === b.recipientEmail
                                ? 'bg-blue-100 border-blue-500 shadow-md'
                                : 'bg-white border-gray-200 hover:border-blue-300 hover:shadow-md'}`}
                    >
                        {/* Delete button - appears on hover */}
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                setShowConfirmDelete(b._id);
                            }}
                            className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-red-50 rounded text-red-400 hover:text-red-600"
                        >
                            <FaTrash size={12} />
                        </button>

                        {/* Confirmation Modal for Delete */}
                        {showConfirmDelete === b._id && (
                            <div className="absolute inset-0 bg-white rounded-xl flex flex-col items-center justify-center p-2 z-10">
                                <p className="text-xs text-center mb-2">Delete?</p>
                                <div className="flex gap-2">
                                    <button
                                        onClick={(e) => { e.stopPropagation(); handleDelete(b._id); }}
                                        className="p-1 bg-red-500 text-white rounded text-xs"
                                    >
                                        <FaCheck size={10} />
                                    </button>
                                    <button
                                        onClick={(e) => { e.stopPropagation(); setShowConfirmDelete(null); }}
                                        className="p-1 bg-gray-300 rounded text-xs"
                                    >
                                        <FaTimes size={10} />
                                    </button>
                                </div>
                            </div>
                        )}

                        <div onClick={() => onSelect(b)} className="cursor-pointer">
                            <div className="flex items-center gap-3 mb-2">
                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white font-bold text-sm shadow-sm">
                                    {b.recipientName.charAt(0).toUpperCase()}
                                </div>

                                <div className="flex-1 min-w-0 pr-6">
                                    {editingId === b._id ? (
                                        <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
                                            <input
                                                type="text"
                                                value={editNickname}
                                                onChange={(e) => setEditNickname(e.target.value)}
                                                className="text-xs border rounded px-1 py-0.5 w-20"
                                                placeholder="Nickname"
                                                autoFocus
                                            />
                                            <button
                                                onClick={() => handleSaveNickname(b._id)}
                                                className="text-green-600 hover:text-green-700"
                                            >
                                                <FaCheck size={10} />
                                            </button>
                                        </div>
                                    ) : (
                                        <div className="flex items-center gap-1">
                                            <p className="font-semibold text-gray-900 truncate text-sm">
                                                {b.nickname || b.recipientName}
                                            </p>
                                            <button
                                                onClick={(e) => { e.stopPropagation(); handleEdit(b); }}
                                                className="opacity-0 group-hover:opacity-100 transition-opacity text-gray-400 hover:text-blue-500"
                                            >
                                                <FaEdit size={10} />
                                            </button>
                                        </div>
                                    )}
                                    <p className="text-xs text-gray-500 truncate">{b.recipientEmail}</p>
                                </div>
                            </div>

                            <div className="flex justify-between items-center pt-2 border-t border-gray-100">
                                <span className="text-[10px] text-gray-400">
                                    Used {b.transferCount} times
                                </span>
                                <span className="text-[10px] text-blue-500 font-medium">
                                    {selectedEmail === b.recipientEmail ? 'Selected ✓' : 'Click to use'}
                                </span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};