
let apiUrl = 'http://localhost:3000/'

if (process.env.NODE_ENV === "production") {
    apiUrl = import.meta.env.VITE_API
}

if (apiUrl && !apiUrl.startsWith('http://') && !apiUrl.startsWith('https://')) {
    apiUrl = 'https://' + apiUrl
}

if (apiUrl && !apiUrl.endsWith('/')) {
    apiUrl += '/'
}

export default apiUrl