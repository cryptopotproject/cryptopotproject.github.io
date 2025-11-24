async function waitForSupabase() {
    if (window.supabaseReady) {
        const ready = await window.supabaseReady;
        if (!ready) throw new Error('Supabase not initialized. Please check your configuration.');
        return ready;
    }
    throw new Error('Supabase not available.');
}

async function getUsers() {
    await waitForSupabase();
    try {
        const { data, error } = await window.supabase.from('users').select('*');
        if (error) throw error;
        const users = {};
        if (data) data.forEach(user => users[user.email] = user);
        return users;
    } catch (error) {
        console.error('Error getting users:', error);
        throw error;
    }
}

async function saveUser(email, userData) {
    await waitForSupabase();
    try {
        const { error } = await window.supabase.from('users').upsert({ email, ...userData }, { onConflict: 'email' });
        if (error) throw error;
        return true;
    } catch (error) {
        console.error('Error saving user:', error);
        throw error;
    }
}

async function saveUsers(users) {
    await waitForSupabase();
    try {
        const userArray = Object.entries(users).map(([email, userData]) => ({ email, ...userData }));
        const { error } = await window.supabase.from('users').upsert(userArray, { onConflict: 'email' });
        if (error) throw error;
        return true;
    } catch (error) {
        console.error('Error saving users:', error);
        throw error;
    }
}

async function deleteUser(email) {
    await waitForSupabase();
    try {
        const { error } = await window.supabase.from('users').delete().eq('email', email);
        if (error) throw error;
        return true;
    } catch (error) {
        console.error('Error deleting user:', error);
        throw error;
    }
}

async function logActivity(type, data) {
    await waitForSupabase();
    const timestamp = new Date().toISOString();
    let ip = 'unknown', location = 'unknown';
    try {
        const response = await fetch('https://ipapi.co/json/');
        const ipData = await response.json();
        ip = ipData.ip || 'unknown';
        location = ipData.city && ipData.country_name ? `${ipData.city}, ${ipData.country_name}` : ipData.country_name || 'unknown';
    } catch (error) {
        try {
            const response = await fetch('https://api.ipify.org?format=json');
            const ipData = await response.json();
            ip = ipData.ip || 'unknown';
        } catch (e) {}
    }
    const logEntry = { type, timestamp, data, ip, location, userAgent: navigator.userAgent, referrer: document.referrer || 'direct' };
    try {
        const { error } = await window.supabase.from('activityLogs').insert([logEntry]);
        if (error) throw error;
        return true;
    } catch (error) {
        console.error('Error logging activity:', error);
        throw error;
    }
}

async function getActivityLogs() {
    await waitForSupabase();
    try {
        const { data, error } = await window.supabase.from('activityLogs').select('*').order('timestamp', { ascending: false });
        if (error) throw error;
        if (data) data.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
        return data || [];
    } catch (error) {
        console.error('Error getting logs:', error);
        throw error;
    }
}

window.supabaseUtils = { getUsers, saveUser, saveUsers, deleteUser, logActivity, getActivityLogs, waitForSupabase };
