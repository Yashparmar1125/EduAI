import jwt from 'jsonwebtoken'

export const createToken=(userId) => {
    return jwt.sign({userId},process.env.JWT_SECRET,{expiresIn:'24h'})
}

export const verifyToken=(token) => {
    return jwt.verify(token,process.env.JWT_SECRET)
}