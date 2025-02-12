export const cart=[] ;

export function addToCart(productId){

    let matchingItem ;
  cart.forEach((cartItem)=>{
    if(productId === cartItem.productId){
      matchingItem= cartItem ; 
    }
  });
  
  const quantitySelector =document.querySelector(`.js-quantity-selector-${productId}`) ;
  //console.log(quantitySelector.value)
  const quantity = parseInt(quantitySelector.value) ;
    if(matchingItem){
      matchingItem.quantity += quantity ;
    }else{ 
    cart.push({
        productId,
        quantity
    });
  }
  }


