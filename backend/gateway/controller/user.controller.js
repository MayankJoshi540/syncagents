const getCurrentUser = async(req,res)=>{
    try {
        if (!req.user) {
            return res.status(401).json({ message: "Unauthorized" });
        }
        return res.status(200).json(req.user);
        
    } catch (error) {
        console.log(error)
        return res.status(500).json({message:"internal server error"})
    }
}       

export default getCurrentUser 
