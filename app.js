const express=require("express");

function validateEmail(email) {
    const re = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return re.test(String(email).toLowerCase());
}
const bodyParser=require("body-parser");
const mongoose=require("mongoose")
const _=require("lodash");


const app=express();


app.use(bodyParser.urlencoded({extended:true}));
app.set("view engine","ejs");
app.use(express.static("public"));

mongoose.connect("mongodb+srv://abubakaran102025:abubakar.123@clusternodeintegration.dlerf8u.mongodb.net/todolistDB?retryWrites=true&w=majority").then((value)=>{console.log("connected")}).catch((err)=>{console.log(err);})

const itemsSchema={
    name: String
}
const Item=mongoose.model("Item",itemsSchema)
const item1=new Item({name:"Welcome to your todo list"});
const item2=new Item({name:"Hit the + button to add a new item"});
const item3=new Item({name:"<-- Hit this to delete an item"});

 const defaultItems=[item1,item2,item3];

 const listSchema={
    name: String,
    items:[itemsSchema]
 }
 const List = mongoose.model("List",listSchema);

app.get("/",function(req,res){

 Item.find({}).then((value)=>{
    if(value.length===0){
        Item.insertMany([item1,item2,item3]).then((value)=>{}).catch((err)=>{console.log(err);})
    }
    res.render("list",{listTitle:"Today", newItems:value});
})
.catch((err)=>{console.log(err);});
    
})
app.get("/:customListName", function(req,res){
    const customListName=_.capitalize(req.params.customListName); 
    List.findOne({name:customListName}).then((value)=>{
        if(value===null){
            console.log("doesnot exist");
            const list=new List({name:customListName,
                items:defaultItems})    
                list.save();
                res.redirect("/"+customListName)
        }
        else{
            res.render("list",{listTitle:value.name,newItems:value.items})
        }
    }).catch((err)=>{console.log(err)})
})

app.get("/about",function(req,res){
    res.render("about");
})

app.post("/",function(req,res){
    const itemName=req.body.newItem;
    const listName=req.body.list;
    const item = new Item({name:itemName})
    if(listName==="Today"){
     item.save()
    res.redirect("/");}
    else{
        List.findOne({name:listName}).then((value)=>{
            value.items.push(item);
            value.save();
            res.redirect("/"+listName)
        }).catch((err)=>{console.log(err);})
    }

})

    
app.post("/delete",function(req,res){
    const checkedItemId=req.body.checkbox;
    const listName=req.body.list;
    if(listName==="Today"){
        Item.deleteOne({_id:checkedItemId}).then((value)=>{}).catch((err)=>{console.log(err);});
        res.redirect("/");
    }
    else{
        List.findOneAndUpdate({name:listName},{$pull: {items:{_id:checkedItemId}}}).then((value)=>{
            if(value){
                res.redirect("/"+listName)
            }
        }).catch((err)=>{console.log(err);})
    }
    
})



app.listen(3000, function(){
    console.log("server started on port number 3000");
})  