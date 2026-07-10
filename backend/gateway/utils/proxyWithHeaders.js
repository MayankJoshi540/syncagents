import proxy from "express-http-proxy";

export const proxyWithUser =
(serviceUrl)=>{

 return proxy(
  serviceUrl,
  {

   proxyReqOptDecorator:
   (proxyReqOpts, srcReq)=>{

     if(srcReq.user){

      const userId = srcReq.user.userId || srcReq.user.userID;
      if (userId) {
        proxyReqOpts.headers["x-user-id"] = String(userId);
      }

      if (srcReq.user.email) {
        proxyReqOpts.headers["x-user-email"] = String(srcReq.user.email);
      }

      if (srcReq.user.avatar) {
        proxyReqOpts.headers["x-user-avatar"] = String(srcReq.user.avatar);
      }

     }

    return proxyReqOpts;

   }

  }
 );

}