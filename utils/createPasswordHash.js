import bcrypt from 'bcrypt';

export const createPasswordHash = async (password) => {
    
    const salt = await bcrypt.genSalt(5);
    const passwordHash = await bcrypt.hash(password, salt);
    return passwordHash
}
