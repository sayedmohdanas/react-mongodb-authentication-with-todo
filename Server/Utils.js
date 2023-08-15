import bcrypt from 'bcrypt'
export const hashPassword =async(password)=>{
const hash =await bcrypt.hash(password,12)
return hash
}
export const  compareHasPassword=async (password ,hash)=>{
    const result =await bcrypt.compare(password,hash)
    return result ;
}