const logMethod = (req: any, _res: any, next: any) => {
    console.log(`${req.method} request received: ${new Date()}`);
    console.log('======================');
    next();
  };
  
  export default logMethod;