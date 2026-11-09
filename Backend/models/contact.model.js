import  {model , Schema} from "mongoose";

const contactSchema = new Schema({
    name : {
        type : String ,
        required : true
    } ,

    email: {
      type : String ,
      unique : true ,
      required : [true , "Email is required"] ,
      match : [
    /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/,
    "Please enter a valid email address",
  ]
    } ,

    phone : {
        type : Number ,
        required : [true , "Phone Number is required"]

    } ,
    subject : {
        type : String ,
        required : [true , "Subject is required"] ,
        enum : [ 
            "Membership Inquiry",
            "Personal Training",
            "Fitness Programs",
            "Other",
        ]
    } ,
     
   message : {
    type : String ,
    required : [true , "Message is required"] ,
    maxlenght : [500 , "message cannot be exceed 500 characters"]
   }

})

const Contact = model("inquirie" , contactSchema)

export default Contact