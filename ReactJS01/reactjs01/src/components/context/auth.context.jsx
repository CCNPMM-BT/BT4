import { createContext, useState, useEffect } from 'react';
import axios from '../../util/axios.customize';

export const AuthContext = createContext({
    isAuthenticated: false,
    user: {
        id: "",
        email: "",
        name: "",
        role: ""
    },
    appLoading: true,
});

export const AuthWrapper = (props) => {
    const [auth, setAuth] = useState({
        isAuthenticated: false,
        user: {
            id: "",
            email: "",
            name: "",
            role: ""
        }
    });
    const [appLoading, setAppLoading] = useState(true);

    const fetchUser = async () => {
        try {
            const token = localStorage.getItem('access_token');
            if (!token) {
                setAppLoading(false);
                return { EC: -1, EM: 'No token found' };
            }
            
            const res = await axios.get('/v1/api/account');
            if (res && res.EC === 0) {
                setAuth({
                    isAuthenticated: true,
                    user: {
                        id: res.DT?._id || res.DT?.id || "",
                        email: res.DT?.email || "",
                        name: res.DT?.name || "",
                        role: res.DT?.role || ""
                    }
                });
            } else {
                // Token invalid, clear it
                localStorage.removeItem('access_token');
                setAuth({
                    isAuthenticated: false,
                    user: { id: "", email: "", name: "", role: "" }
                });
            }
            return res;
        } catch (error) {
            console.error('Error fetching user:', error);
            // Clear invalid token
            localStorage.removeItem('access_token');
            setAuth({
                isAuthenticated: false,
                user: { id: "", email: "", name: "", role: "" }
            });
            return { EC: -1, EM: 'Failed to fetch user' };
        } finally {
            setAppLoading(false);
        }
    };

    useEffect(() => {
        fetchUser();
    }, []);

    return (
        <AuthContext.Provider value={{ auth, setAuth, appLoading, setAppLoading, fetchUser }}>
            {props.children}
        </AuthContext.Provider>
    );
};