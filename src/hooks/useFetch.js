import { useState } from "react";

export function useFetch() {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [controller, setController] = useState(null);

    const fetchData = async (endpoint) => {
        const url = "http://localhost:5000/" + endpoint
        const abortController = new AbortController();
        setController(abortController)
        setLoading(true);

        fetch(url, { signal: abortController.signal })
            .then((response) => response.json())
            .then((data) => setData(data))
            .catch((error) => {
                if (error === "AbortError") {
                    console.log("Request cancelled")
                } else {
                    setError(error)
                }
            })
            .finally(() => setLoading(false));
    }

    const handleCancelRequest = () => {
        if (controller) {
            controller.abort();
            setError("Request cancelled");
        }
    }

    return { data, loading, error, fetchData };
}