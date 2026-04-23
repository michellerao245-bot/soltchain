const { ethers } = require('ethers');

/**
 * @dev BscScan Verification ke liye Constructor Arguments ko Hex mein encode karta hai.
 */
const encodeArgs = (tokenType, name, symbol, supply, decimals, owner, devWallet, tax) => {
    try {
        const abiCoder = ethers.AbiCoder.defaultAbiCoder();
        
        // 🛡️ Safe Fallbacks: Agar koi value undefined/null hai toh crash na ho
        const _name = name || "SoltToken";
        const _symbol = symbol || "SOLT";
        const _decimals = parseInt(decimals) || 18;
        const _owner = owner || "0x0000000000000000000000000000000000000000";
        
        // Supply handling: Pehle string mein convert karo phir units parse karo
        const supplyStr = supply ? supply.toString() : "0";
        const amount = ethers.parseUnits(supplyStr, _decimals);

        let encoded;

        if (tokenType === 'FeeToken') {
            // FeeToken Constructor: (string n, string s, uint256 sup, uint8 d, uint256 tax, address dev, address owner)
            const _tax = tax || 500; // Default 5%
            const _dev = devWallet || _owner;

            encoded = abiCoder.encode(
                ["string", "string", "uint256", "uint8", "uint256", "address", "address"],
                [_name, _symbol, amount, _decimals, _tax, _dev, _owner]
            );
        } else {
            // Standard aur Burnable Constructor: (string n, string s, uint256 sup, uint8 d, address owner)
            encoded = abiCoder.encode(
                ["string", "string", "uint256", "uint8", "address"],
                [_name, _symbol, amount, _decimals, _owner]
            );
        }

        // BscScan ko bina '0x' ke hex string chahiye hoti hai
        return encoded.startsWith('0x') ? encoded.slice(2) : encoded;

    } catch (error) {
        console.error("❌ Encoder Error:", error.message);
        // Error ke case mein empty string return karo taaki verification skip ho jaye par server na phate
        return ""; 
    }
};

module.exports = { encodeArgs };