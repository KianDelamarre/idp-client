// idp-client.js

export async function getPublicKeyFromIdp(idpUrl, options = {}) {
    const { maxRetries = 10, delayMs = 2000 } = options;
    let attempts = 0;

    while (attempts < maxRetries) {
        try {
            console.log(`🔒 Fetching public key from IdP (attempt ${attempts + 1})...`);
            
            const response = await fetch(`${idpUrl}/public-key`);
            if (!response.ok) {
                throw new Error(`HTTP Error ${response.status}: ${response.statusText}`);
            }
            
            const data = await response.json();
            return data; // Success! Return key and exit loop
            
        } catch (error) {
            attempts++;
            if (attempts >= maxRetries) {
                throw new Error(`Failed to fetch public key after ${maxRetries} attempts: ${error.message}`);
            }

            console.warn(`⏳ IdP not ready (${error.message}). Retrying in ${delayMs / 1000}s...`);
            await new Promise(resolve => setTimeout(resolve, delayMs));
        }
    }
}