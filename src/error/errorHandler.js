import ApiError from "./apiError.js";

const errorHandler = (error, req, res, next) => {
    if (error instanceof ApiError) {
        return res.status(error.status).json({ message: error.message })
    }
    return res.status(500).json({ message: error.message || "Unexpected error!" })
}

export default errorHandler;