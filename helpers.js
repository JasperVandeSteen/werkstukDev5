const helpers = {
    /**
     * checks if string length is smaller than or equal to 10
     * @param {string} str the user given string 
     * @param {int} lngth How long the string may be
     * @returns false if not a string or too long, otherwise string itself
     */
    checkStringLength(str, lngth) {
        return str && str.length >= lngth ? str : false;
    },

    /**
     * check if a given string is a url
     * @param {string} url 
     * @returns true if url, false if not
     */
    checkIfURL(url) {
        if (url) {
            const regex = /[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/g;
            return regex.test(url);
        }
        return false;
    },

    /**
     * check if body send by endpoint is in order
     * @param {object} body 
     * @returns {object} body if all is capitalised and shortened, or false if something missing
     */
    bodyCheck(body) {
        if (body && body.naam && body.email) {
            const {
                naam,
                email
            } = body;
            if (naam.includes(" ") && email.includes("@")) {
                return {
                    ...body,
                    naam: naam,
                    email: email
                }
            }
        }
        return false;
    },
}

module.exports = helpers;