
const successCode = (res, content, statusCode, message) => {
    res.status(statusCode).json({
        message,
        statusCode,
        content,
        date: new Date()
    })
}


const failCode = (res, content, statusCode, message) => {
    res.status(statusCode).json({
        message,
        statusCode,
        content,
        date: new Date()
    })
}


const errorCode = (res, message) => {
    res.status(500).json({
        message,
        statusCode: 500,
        date: new Date()
    })
}

export {
    successCode,
    failCode,
    errorCode,
}