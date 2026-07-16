const https = require('https');

console.log("Fetching Google Auth initiation URL via native https...");
https.get('https://eye-pill-pqdi.vercel.app/api/auth/google', (res) => {
    const location = res.headers.location;
    console.log("Redirect Location:", location);
    
    if (location) {
        const url = new URL(location);
        console.log("\nParsed Query Parameters:");
        console.log("client_id:", url.searchParams.get('client_id'));
        console.log("redirect_uri:", url.searchParams.get('redirect_uri'));
    } else {
        console.log("No redirection header found. Status:", res.statusCode);
    }
}).on('error', (err) => {
    console.error("Error:", err.message);
});
