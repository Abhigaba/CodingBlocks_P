import { coupen } from "../models/coupen";

export function checkEleigibility(product, coupon) {
 
    const isBrandEligible = product.brand === coupon.applicabelBrand;

    if (isBrandEligible || coupon.is_All_Brand) {
        return true;
    }
    
    if (isBrandEligible && coupon.productChunks && coupon.productChunks.length > 0) {
        return coupon.productChunks.some(chunk => 
            chunk.products.includes(product._id.toString())
        );
    }

    return isBrandEligible;
}