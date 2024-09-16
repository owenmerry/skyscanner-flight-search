// Import the 'buffer' module (not necessary in Node >= 10)
const { Buffer } = require('buffer');

// Function to decode a Base64 string
function decodeBase64(base64String) {
    // Decode the Base64 string
    const decodedString = Buffer.from(base64String, 'base64').toString('utf-8');
    
    // Output the decoded string
    console.log('Decoded string:', decodedString);
}

// Get the Base64 string from command line arguments
const base64String = process.argv[2];  // The Base64 string is the second argument (after the script name)

// Check if the Base64 string was provided
if (!base64String) {
    console.log('Please provide a Base64 encoded string as an argument.');
    process.exit(1);
}

// Call the function to decode the provided Base64 string
decodeBase64(base64String);