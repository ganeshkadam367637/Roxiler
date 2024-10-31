const {createProxyMiddleware} = require("http-proxy-middleware")

module.exports = app => {
    
    app.use(
        createProxyMiddleware('/roxiler.com/product_transaction.json',
            {
                target:'https://s3.amazonaws.com',
                changeOrigin : true
            }
        )
    )
}
