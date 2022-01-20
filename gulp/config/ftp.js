const {
    FTP_HOST,
    FTP_USER,
    FTP_PASSWORD,
    FTP_PORT,
    FTP_DEST,
    FTP_URI
} = process.env;

module.exports = {
    default: {
        host: FTP_HOST,
        user: FTP_USER,
        password: FTP_PASSWORD,
        port: FTP_PORT || 21,
        dest: FTP_DEST,
        uri: FTP_URI
    }
};