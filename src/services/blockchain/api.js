
export const postData = async (endpoint, data) => {
    const url = "http://localhost:5000/" + endpoint

    return fetch(url, { 
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })
};

export const fetchData = async (endpoint) => {
    const url = "http://localhost:5000/" + endpoint

    const abortController = new AbortController();

    return fetch(url, { signal: abortController.signal })
};