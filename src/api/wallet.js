import api from "./axiosInstance.js";


export const setWalletPin = (pin) => {
    return api.post("/wallet/set-pin", { pin });

};

export const verifyWalletPin = (pin) => {
    return api.post("/wallet/verify-pin", { pin });
};

export const fundWalletManual = (amount, pin) => {
    return api.post("/wallet/fund/manual", { amount, pin });
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



