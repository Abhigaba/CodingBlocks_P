import {LazyImage} from "./LazyImage"
import { ShoppingBag, Heart } from 'lucide-react';
import { useCartContext } from "../contexts/useCartContext";
import { useAuthContext } from "../contexts/useAuthContext";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { useProductContext } from "../contexts/useProductConext";

export const ProductCard = ({ product }) => {
    const router = useRouter()
    const {info} = useAuthContext()
    const {toast} = useToast()
    const {sale} = useProductContext();

    const calculateDiscountedPrice = (originalPrice, discount, sale_discount) => {
        if (sale) return originalPrice - (originalPrice*(sale_discount/ 100))
        if (discount) return originalPrice - (originalPrice * (discount / 100));
        return originalPrice;
    };

    const {addToCart} = useCartContext()
    const handleAddtoCart = (e) => {
        e.stopPropagation();
        if (info._id){
            addToCart(product)
            toast({
                title: "Success",
                description : "Item successfully added to cart",
                variant: "success"
            })
        } else {
            toast({
                title: "Authentication Required",
                description : "Please Login to add item to your cart",
                variant: "destructive"
            })
        }
    }

    const handleCardClick = () =>{
        router.replace(`/Product/${product._id}`)
    }

    return (
        <div onClick={(e) => handleCardClick(e)} className="bg-white rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 relative">
            <div className="relative group">
                <LazyImage
                    src={product.imageUrl}
                    alt={product.name}
                    className="w-full h-64 object-cover"
                />
                
                <div className="absolute top-4 left-4 z-10 flex gap-2">
                    {/* Sale Tag - Appears when sale is true */}
                    {product.on_sale && (
                        <div className="bg-gradient-to-r from-pink-500 to-purple-500 text-white px-3 py-1 pt-2 rounded-full text-xs font-bold uppercase tracking-wider shadow-lg animate-pulse">
                            Sale
                        </div>
                    )}

                    {/* Discount Tag */}
                    {(product.discount > 0 || (product.on_sale && product.sale_discount > 0)) && (
                        <div className="bg-red-500 text-white px-2 py-1 rounded-full">
                            -{product.on_sale ? product.sale_discount : product.discount}%
                        </div>
                    )}
                </div>

                <div className="absolute top-4 right-4">
                    <button className="bg-white p-2 rounded-full shadow-md hover:bg-gray-100">
                        <Heart className="w-5 h-5 text-gray-600" />
                    </button>
                </div>

                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300 flex items-center justify-center">
                    <button 
                        onClick={(e) => handleAddtoCart(e)} 
                        className="opacity-0 group-hover:opacity-100 bg-white text-black px-6 py-2 rounded-full flex items-center gap-2 transform translate-y-4 group-hover:translate-y-0 transition-all duration-300"
                    >
                        <ShoppingBag className="w-4 h-4" />
                        Add to Cart
                    </button>
                </div>
            </div>

            <div className="p-6">
                <div className="text-sm text-gray-500 mb-1">{product.brand}</div>
                <h3 className="text-lg font-semibold mb-2">{product.name}</h3>
                <div className="flex items-center gap-2">
                    {product.discount > 0 ? (
                        <>
                            <span className="text-xl font-bold text-red-600">
                                ${calculateDiscountedPrice(product.price, product.discount, product.sale_discount).toFixed(2)}
                            </span>
                            <span className="text-gray-500 line-through text-sm">
                                ${product.price}
                            </span>
                        </>
                    ) : (
                        <span className="text-xl font-bold">
                            ${product.price}
                        </span>
                    )}
                </div>
            </div>
        </div>
    );
};