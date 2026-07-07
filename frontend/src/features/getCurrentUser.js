import api from "../../utils/axios";
const getCurrentUser = async () => {
    try {
        const response = await api.get("/api/me")
        console.log(response)
        return response;
    }
    catch (error) {
        console.log(error)
    }
}
export default getCurrentUser