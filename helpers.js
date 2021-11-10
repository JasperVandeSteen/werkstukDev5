const helpers = {
    /**
     * checks if string length is smaller than or equal to 10
     * @param {string} str the user given string 
     * @param {int} lngth How long the string may be
     * @returns false if not a string or too long, otherwise string itself
     */
    checkStringLength(str, lngth) {
        return str && typeof str == "string" && str.length <= lngth ? str : false;
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
}

module.exports = helpers;