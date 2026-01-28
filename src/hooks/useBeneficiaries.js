import { useState, useEffect, useCallback } from 'react';
import api from '../services/api';

export const useBeneficiaries = () => {
    const [beneficiaries, setBeneficiaries] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchBeneficiaries = useCallback(async () => {
        setLoading(true);
        try {
            const response = await api.get('/beneficiaries');
            setBeneficiaries(response.data.beneficiaries || []);
            setError(null);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to load beneficiaries');
            console.error('Error fetching beneficiaries:', err);
        } finally {
            setLoading(false);
        }
    }, []);

    // Delete beneficiary
    const deleteBeneficiary = async (id) => {
        try {
            await api.delete(`/beneficiaries/${id}`);
            setBeneficiaries(prev => prev.filter(b => b._id !== id));
            return true;
        } catch (err) {
            console.error('Error deleting beneficiary:', err);
            return false;
        }
    };

    // Update nickname
    const updateNickname = async (id, nickname) => {
        try {
            const response = await api.patch(`/beneficiaries/${id}/nickname`, { nickname });
            setBeneficiaries(prev => prev.map(b =>
                b._id === id ? { ...b, nickname: response.data.beneficiary.nickname } : b
            ));
            return true;
        } catch (err) {
            console.error('Error updating nickname:', err);
            return false;
        }
    };

    useEffect(() => {
        fetchBeneficiaries();
    }, [fetchBeneficiaries]);

    return {
        beneficiaries,
        loading,
        error,
        refetch: fetchBeneficiaries,
        deleteBeneficiary,
        updateNickname
    };
};