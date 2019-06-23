var alert = (res, msg) => {
    res.send('<script>alert("' + msg + '");</script>');
}

module.exports = alert;