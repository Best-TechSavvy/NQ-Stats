// Check if a number is prime
function isPrime(num) {
    if (num < 2) return false;
    for (let i = 2; i * i <= num; i++) {
        if (num % i === 0) return false;
    }
    return true;
}

// Compute GCD
function gcd(a, b) {
    return b === 0 ? a : gcd(b, a % b);
}

// Extended Euclidean Algorithm for modular inverse
function modInverse(a, m) {
    let m0 = m, t, q;
    let x0 = 0, x1 = 1;

    if (m === 1) return 0;

    while (a > 1) {
        q = Math.floor(a / m);
        t = m;
        m = a % m;
        a = t;
        t = x0;
        x0 = x1 - q * x0;
        x1 = t;
    }

    if (x1 < 0) x1 += m0;
    return x1;
}

// Fast modular exponentiation using BigInt
function modPow(base, exponent, modulus) {
    base = BigInt(base);
    exponent = BigInt(exponent);
    modulus = BigInt(modulus);

    let result = 1n;
    base = base % modulus;

    while (exponent > 0n) {
        if (exponent % 2n === 1n) {
            result = (result * base) % modulus;
        }
        exponent = exponent / 2n;
        base = (base * base) % modulus;
    }
    return result;
}

// Convert a block of characters to a BigInt using base-256 encoding
function blockToBigInt(block) {
    let value = 0n;
    for (let i = 0; i < block.length; i++) {
        value = value * 256n + BigInt(block.charCodeAt(i));
    }
    return value;
}

// Convert BigInt back to characters using base-256 decoding
function bigIntToBlock(num) {
    let chars = [];
    while (num > 0n) {
        chars.unshift(String.fromCharCode(Number(num % 256n)));
        num = num / 256n;
    }
    return chars.join('');
}

function encryption(task) {
    var p = parseInt(document.getElementById("p").value);
    var q = parseInt(document.getElementById("q").value);
    var e = parseInt(document.getElementById("e").value);
    var paddingChar = document.getElementById("padding").value || "";

    // Validate primes
    if (!isPrime(p) || !isPrime(q)) {
        alert("p and q must be prime numbers!");
        return;
    }

    var n = p * q;
    var phi = (p - 1) * (q - 1);

    if (gcd(e, phi) !== 1) {
        alert("e must be coprime with φ(n)!");
        return;
    }

    var d = modInverse(e, phi);

    // Dynamic block size based on n
    let maxBlockValue = BigInt(n);
    let blockSize = 1;
    let testValue = 256n;
    while (testValue < maxBlockValue) {
        blockSize++;
        testValue *= 256n;
    }
    blockSize--; // Last valid size

    if (task === "encrypt") {
        var plaintext = document.getElementById("plaintext").value.trim();
        if (paddingChar) plaintext = paddingChar + plaintext + paddingChar;

        let cipher = "";
        for (let i = 0; i < plaintext.length; i += blockSize) {
            let block = plaintext.slice(i, i + blockSize);
            let blockInt = blockToBigInt(block);
            let encrypted = modPow(blockInt, e, n);
            cipher += encrypted.toString(16) + " ";
        }
        document.getElementById("cipher").value = cipher.trim();
    } else {
        var ciphertext = document.getElementById("cipher").value.trim();
        let hexBlocks = ciphertext.split(" ");
        let decryptedText = "";
        for (let block of hexBlocks) {
            if (block === "") continue;
            let encryptedNum = BigInt("0x" + block);
            let decrypted = modPow(encryptedNum, d, n);
            decryptedText += bigIntToBlock(decrypted);
        }
        if (paddingChar && decryptedText.startsWith(paddingChar) && decryptedText.endsWith(paddingChar)) {
            decryptedText = decryptedText.slice(1, -1);
        }
        document.getElementById("plaintext").value = decryptedText;
    }
}