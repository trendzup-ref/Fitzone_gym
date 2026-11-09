import Contact from "../models/contact.model.js";
 
// creating a contact form 

const createContact = async(req , res ) => {
 
    try {
       const {name , email , phone , subject , message } = req.body 

       if(!name  || !email || !phone  || !subject || !message ){
        return res.status(400).json({
            success : false  ,
            message : "All field are required "
        })
       }

     const contact = await Contact.create({
        name , email , phone , subject , message 
     })
      
     return res.status(201).json({
        success : true ,
        message : "your message has been submited successfully"
     })
    } catch (error) {
        console.log(error)
        return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
    }
}

export default createContact