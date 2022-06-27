const mongoose=require("mongoose");

const schema=new mongoose.Schema({
    _id:{
        type:mongoose.Types.ObjectId
    },

   cityName:{
    type:String,
    required:true

   },
// you need sure
   units:{type:[{type:mongoose.Types.ObjectId,
                  ref:"units"}],
                  required:true,
   }

})



mongoose.model("cities",schema)