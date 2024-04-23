import { useState } from "react";

export function usePost() {
    const [response, setResponse] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const postData = async (endpoint, data) => {
        const url = "http://localhost:5000/" + endpoint
        setLoading(true);

        fetch(url, { 
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            })
            .then((response) => response.json())
            .then((data) => setResponse(data))
            .catch((error) => {
                setError(error)
            })
            .finally(() => setLoading(false));
    }

    return { response, loading, error, postData };
}