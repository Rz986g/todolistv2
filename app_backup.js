const date = require(__dirname+"/date.js");
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const ejs = require("ejs");
const listDate = (date.date());
const itemList = []
app.set("view engine","ejs");
app.use(express.static(__dirname+"/views/public"));
app.use(bodyParser.urlencoded({extended:true}));
mongoose.connect('mongodb://localhost:27017/todolistv2');


const itemSchema = new mongoose.Schema({
    listDate:String,
    item:String,
});
const Item = mongoose.model("Item",itemSchema);

const listSchema = new mongoose.Schema({
    listName:String,
    listItem:[itemSchema],
});

const List = mongoose.model("List",listSchema);

// Main List================================
app.get("/",(req,res)=>{
    Item.find((err,finditems)=>{
        if(!err){
            res.render("list",{listDate:listDate, list:"MyList", items:finditems});
        }
    })
})

app.post("/",(req,res)=>{
    const todo = (req.body.todo);
    const list=req.body.list;

    const item = new Item({
        listDate :listDate,
        item:todo
    })
    if (list === "MyList"){
    item.save()
    res.redirect("/")}
    else{
        List.findOne({listName:list},(err,doc)=>{
            if(!err){
                
                doc.listItem.push(item)
                doc.save()
                console.log("Updated! "+doc.listItem)
                res.redirect("/"+list)
                }
            
            
            
        })
    }

})

app.post("/delete",(req,res)=>{
    const itemId=req.body.item;
    const checkList = req.body.checkList;
    if(checkList==="MyList"){
        Item.findByIdAndDelete(itemId,(err,doc)=>{
            if(!err){console.log(doc+" has been deleted");}
        });
        res.redirect("/")
    }else{
        console.log("ID :"+itemId)
        console.log("list "+checkList);
        List.findOneAndUpdate({listName:checkList},{$pull:{listItem:{_id:itemId}}},(err,doc)=>
        {if(!err){console.log("Deleted "+doc.listItem._id);}
        res.redirect("/"+checkList)
        })
    }
   
})

app.get("/:customerList",(req,res)=>{
    const customerList = req.params.customerList;
    console.log(req.params.customerList);
    List.findOne({listName:customerList},(err,doc)=>
    {if (!err){
        
        if (!doc){
           const list = new List({
            listName:customerList,
            listItem:[]
            })
            list.save()
            console.log(customerList + " is created!");
            res.redirect("/"+customerList)

        }else{
            // console.log(doc.listItem);
            res.render("list",{listDate:listDate, list:doc.listName, items:doc.listItem})
        }
    }})
})



app.listen(3000,()=>{console.log("The Server is running on port 3000")});