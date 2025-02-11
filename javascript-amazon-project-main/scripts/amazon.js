import { products } from '../data/products.js';
import {cart} from '../data/cart.js' ;

let productHTML='' ;
products.forEach((product)=>{
   // const image = product.image ;
   productHTML+=`
     <div class="product-container">
          <div class="product-image-container">
            <img class="product-image"
              src="${product.image}">
          </div>

          <div class="product-name limit-text-to-2-lines">
            ${product.name}
          </div>

          <div class="product-rating-container">
            <img class="product-rating-stars"
              src="images/ratings/rating-${product.rating.stars *10}.png">
            <div class="product-rating-count link-primary">
              ${product.rating.count}
            </div>
          </div>

          <div class="product-price">
            $${(product.priceCents /100).toFixed(2)} 
          </div>

          <div class="product-quantity-container">
            <select class="js-quantity-selector-${product.id}">
              <option selected value="1">1</option>
              <option value="2">2</option>
              <option value="3" >3</option>
              <option value="4" >4</option>
              <option value="5" >5</option>
              <option value="6" >6</option>
              <option value="7" >7</option>
              <option value="8"  >8</option>
              <option value="9"  >9</option>
              <option value="10" >10</option>
            </select>
          </div>

          <div class="product-spacer"></div>

          <div class="added-to-cart js-check-${product.id}">
            <img src="images/icons/checkmark.png">
            Added
          </div>
          <button class="js-add-to-cart add-to-cart-button button-primary"
          data-product-id="${product.id}">
            Add to Cart
          </button>
        </div>
    `;
    document.querySelector('.js-products-grid')
    .innerHTML= productHTML ;
    

}) ;
let stopTime  ;
const addedMessageTimeouts = {};
document.querySelectorAll('.js-add-to-cart')
.forEach((button) =>{ 
  button.addEventListener('click', () => {
  //console.log('added to cart') ;
  const productId = button.dataset.productId ;
  let matchingItem='' ;
cart.forEach((item)=>{
  if(productId === item.productId){
    matchingItem= item ; 
  }
});
/*
// Display added to cart message
const addedToCartMessage = document.querySelector(`.js-check-${productId}`);
addedToCartMessage.classList.add('js-added-msg') ;
// Remove button functionality
clearTimeout(stopTime) ;
stopTime = setTimeout(()=>{
  document.querySelector('.js-added-msg').remove() ;
} ,2000) ;
*/


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
let cartQuantity= 0 ;
cart.forEach((item)=>{
  cartQuantity += item.quantity ;
});

let cardQ= document.querySelector('.js-quantity');
cardQ.textContent = cartQuantity ;
 // save cart into a local storage 
 //localStorage.setItem('cart',JSON.stringify(cart)) ;

const addedToCartMessage =document.querySelector(`.js-check-${productId}`);

addedToCartMessage.classList.add('js-added-msg');
setTimeout(() => {
  
  const oldTimeout = addedMessageTimeouts[productId] ;
  if(oldTimeout){
    clearTimeout(oldTimeout) ;
  }
  const timeOutId = setTimeout(() => {
    addedToCartMessage.classList.remove('js-added-msg') ;
  }, 2000);


  addedMessageTimeouts[productId] = timeOutId ;
}, 2000);
})

}

);




//save quantity into a local storage 


