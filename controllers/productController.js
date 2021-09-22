const Product = require('../models/productModel')

//Filter, sorting and paginating




const productController = {
    getProducts: async (req,res) => {
        try{    
            let products;
            const {category, sort} = req.query

           if(!category && !sort)
            {
                products = await Product.find()
                 res.json(products)
            }else {
                const query = {}
                let priceSort = "-_id" ;
                if(sort){
                    if(sort === "lowest"){
                        priceSort = "price";
                    }
                    if(sort === "highest"){
                        priceSort = "-price"
                    }
                }
                if(category){
                    query["category"] = category;
                }
                products = await Product.find(query)
                .sort(priceSort)

                res.json(products)
            }
          
        }catch(err){
            return res.status(500).json({msg:err.message})
        }
    },
   createProduct: async(req,res) => {
        try{
            
            const { name, price, description, image, category,rating,countInStock } = req.body;
            const product = new Product({
            name: name || "Sample name",
            price: price || 0,
             // user: req.user._id,
             image:
             image ||  "https://www.netmeds.com/images/product-v1/600x600/14149/tentex_royal_capsule_10_s_0.jpg",
            category: category || "medicine",
            description: description || "Sample description",
             rating: rating || "5",
             countInStock: countInStock || "20"
        })
        await product.save()
        res.json({msg:"Product Created Successfully"})

        }catch(err){
            return res.status(500).json({msg:err.message})
        }
    },

    deleteProduct: async(req,res) => {
        try{
                const product = await Product.findByIdAndDelete(req.params.id);
                 res.json({ message: "Product removed" });
              
        }catch(err){
            return res.status(500).json({msg:err.message})
        }
    },
    updateProduct: async(req,res) => {
        try{

            const { name, price, description, image, category,rating,countInStock } = req.body;
            const product = await Product.findById(req.params.id);
          
            if (product) {
                product.name = name || product.name;
                product.price = price || product.price;
                product.description = description || product.description;
                product.image = image || product.image;
                product.category = category || product.category;
                product.rating = rating || product.rating;
                product.countInStock = countInStock || product.countInStock;

                const updatedProduct = await product.save();
               
                res.json(updatedProduct);
            } else {
                res.status(404);
                throw new Error("Product not found");
            }
        }catch(err){
            return res.status(500).json({msg:err.message})
        }
    },
}   

module.exports = productController;