const logoutController ={};

logoutController.logout = async(req,res) => {
try {
res.clearCookie("authToken");
return res.status(200).json({message: "Se cerro sesión"});
} catch (error) {
console.log("Error al cerrar sesión:", error);
res.status(500).json({ message: "Internal server error" })
};
}
export default logoutController;