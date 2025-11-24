function generatePseudoTransactions(coinBalances, accountCreatedAt) {
    const transactions = [];
    const coins = ['BTC', 'DOGE', 'ETH', 'LTC', 'XRP', 'ADA'];
    const createdDate = new Date(accountCreatedAt);
    const numTransactions = Math.floor(Math.random() * 5) + 8;
    
    for (let i = 0; i < numTransactions; i++) {
        const coin = coins[Math.floor(Math.random() * coins.length)];
        const coinData = coinBalances[coin];
        const balance = (coinData && typeof coinData === 'object' && coinData.balance) ? coinData.balance : (coinData || 0);
        const daysAgo = Math.floor(Math.random() * 60) + 1;
        const transactionDate = new Date(createdDate);
        transactionDate.setDate(transactionDate.getDate() - daysAgo);
        const isReceive = Math.random() > 0.3;
        const type = isReceive ? 'receive' : 'send';
        let amount = isReceive ? balance * (0.05 + Math.random() * 0.25) : balance * (0.01 + Math.random() * 0.14);
        amount = Math.round(amount * 100000000) / 100000000;
        const address = generateRandomAddress(coin);
        const txId = generateTxId();
        const transaction = {
            type, coin, amount, address, txId, status: 'completed',
            date: transactionDate.toISOString(),
            description: type === 'receive' ? `Received ${coin} from ${address.substring(0, 8)}...` : `Sent ${coin} to ${address.substring(0, 8)}...`,
            confirmations: Math.floor(Math.random() * 3) + 3
        };
        transactions.push(transaction);
    }
    transactions.sort((a, b) => new Date(b.date) - new Date(a.date));
    return transactions;
}

function generateRandomAddress(coin) {
    const prefixes = { 'BTC': 'bc1q', 'DOGE': 'D', 'ETH': '0x', 'LTC': 'ltc1', 'XRP': 'r', 'ADA': 'addr1' };
    const prefix = prefixes[coin] || '1';
    const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let address = prefix;
    for (let i = 0; i < 30; i++) address += chars.charAt(Math.floor(Math.random() * chars.length));
    return address;
}

function generateTxId() {
    const chars = 'abcdef0123456789';
    let txId = '';
    for (let i = 0; i < 64; i++) txId += chars.charAt(Math.floor(Math.random() * chars.length));
    return txId;
}
