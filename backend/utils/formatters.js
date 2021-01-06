/**
 * Return a object file for image.
 * 
 * @param {*} file - Object or array of files sent from the client.
 * @param {*} req - Http request from the clients.
 * @returns {Object}
 */
const imageFormarter = (file, req) => {
    if (!file) {
        return {}
    }

    return {
        "originalname": file.originalname,
        "encoding": file.encoding,
        "mimetype": file.mimetype,
        "filename": file.filename,
        "size": file.size,
        "url": `${getDomainName(req)}${file.filename}`
    }
}

/** 
 * Returns domain name for the image url.
 * 
 * @param {Object} req - Http request from the clients.
 * @returns {String}
 */
const getDomainName = (req) => {
    return req.protocol + '://' + req.get('host') + '/'
}

module.exports = {
    imageFormarter,
    getDomainName
}