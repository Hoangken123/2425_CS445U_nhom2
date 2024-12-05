const indexSellPage  = async (req,res) =>{
    res.render("page/sellproduct/index", {
        layout: "../view/share/index",
        title: "Quản lý bán hàng ",
        customScript: "/page/sellproduct/index.js",
      });
}
const addToinvoice = async (req,res) =>{
    console.log(req.body);
    
}
module.exports ={
    indexSellPage,
    addToinvoice
}