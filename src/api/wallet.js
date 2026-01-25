import api from "./axiosInstance.js";

// PIN Management
export const getPinStatus = () => {
    return api.get("/wallet/pin/status");
};

export const setWalletPin = (pin, password) => {
    return api.post("/wallet/pin/set", { pin, password });
};

export const changeWalletPin = (newPin, currentPin = null, password = null) => {
    return api.post("/wallet/pin/change", {
        newPin,
        currentPin,
        password
    });
};

export const verifyWalletPin = (pin) => {
    return api.post("/wallet/pin/verify", { pin });
};

export const fundWalletPaystack = (amount) => {
    return api.post("/wallet/fund/paystack", { amount });
};

export const transferFunds = (recipientEmail, amount, pin) => {
    return api.post("/wallet/transfer", {
        recipientEmail,
        amount,
        pin
    });
};



