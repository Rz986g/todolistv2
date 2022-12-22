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
// mongoose.connect('mongodb://localhost:27017/todolistv2');
mongoose.connect('mongodb+srv://Rccw:Rofusabc1999@cluster0.x3a0wqs.mongodb.net/todolistv2');

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
    const listz=req.body.list;

    const item = new Item({
        listDate :listDate,
        item:todo
    })
    if(listz==="MyList"){
    item.save()
    res.redirect("/")}
    else{
        List.findOneAndUpdate({listName:listz},{$push:{listItem:item}},(err,doc)=>
        {if(!err){console.log(doc);
        doc.save()}
        res.redirect("/"+listz)}
        )
    }
})

app.post("/delete",(req,res)=>{
    const itemId=req.body.item;
    const list =req.body.checkList;
    const checkList = req.body.checkList;
    if (list ==="MyList"){
        Item.findByIdAndDelete(itemId,(err,doc)=>{
            if(!err){console.log(doc+" has been deleted");}
        });
        res.redirect("/")
    }else{
        console.log("This is the list of "+ list);
        List.findOneAndUpdate({listName:list},{$pull:{listItem:{_id:itemId}}},(err,doc)=>{
            if(!err){
                console.log(doc);
            }
        })
        res.redirect("/"+list)
    }
        
   
   
})

app.get("/:customerList",(req,res)=>{
    const customerList = req.params.customerList;
    // console.log(req.params.customerList);
    List.findOne({listName:customerList},(err,docc)=>{if(!err){
        if (!docc){
            const list = new List({
                listName:customerList,
                listItem:[],
            })
            list.save()
            console.log("The New List is created! "+customerList);
            res.redirect("/"+customerList)
        }else{
            res.render("list",{listDate:listDate, list:docc.listName, items:docc.listItem})   
        }
    }}
    )

})
app.listen(3000,()=>{console.log("The Server is running on port 3000")});