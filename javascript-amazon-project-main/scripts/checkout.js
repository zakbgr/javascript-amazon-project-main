import { products } from '../data/products.js';
import {cart,removeFromCart,calculateCartQuantity,updateQuantity,getItemQuantity} from '../data/cart.js' ;
import formatCurrency  from './utils/money.js';
//import {hello} from 'https://unpkg.com/supersimpledev@1.0.1/hello.esm.js' ;
import dayjs from 'https://unpkg.com/dayjs@1.11.10/esm/index.js' ;

const today= dayjs() ;
const deliveryDate = today.add(7,'days') ;
//console.log(deliveryDate) ;
console.log(deliveryDate.format(`dddd, MMMM , D`)) ; 



let cartSummaryHTML='';
 cart.forEach((cartItem)=>{

    const productId = cartItem.productId ;
    let matchingProduct ;
    products.forEach((product)=>{
        if(productId === product.id){
            matchingProduct = product ;
        }
    }) ;

    cartSummaryHTML+=`  <div class="cart-item-container
    js-cart-item-container-${matchingProduct.id}
    "
    >
            <div class="delivery-date">
              Delivery date: Tuesday, June 21
            </div>

            <div class="cart-item-details-grid">
              <img class="product-image"
                src="${matchingProduct.image}">

              <div class="cart-item-details">
                <div class="product-name">
                 ${matchingProduct.name}
                </div>
                <div class="product-price">
                  $${formatCurrency(matchingProduct.priceCents)}
                </div>
                <div class="product-quantity">
                  <span>
                    Quantity: <span class="quantity-label js-quantity-label-${matchingProduct.id} ">${cartItem.quantity}</span>
                  </span>
                  <span class="update-quantity-link link-primary js-update-link "
                  data-product-id="${matchingProduct.id}">
                    Update
                  </span> 
                  <input class="quantity-input js-input-${matchingProduct.id}"><span class="save-quantity-link link-primary js-save-${matchingProduct.id}" 
                   data-product-id="${matchingProduct.id}">save</span>
                  
                  <span class="delete-quantity-link link-primary js-delete-link"
                  data-product-id="${matchingProduct.id}"
                  >
                    Delete
                  </span>
                </div>
              </div>

              <div class="delivery-options">
                <div class="delivery-options-title">
                  Choose a delivery option:
                </div>
                <div class="delivery-option">
                  <input type="radio" checked
                    class="delivery-option-input"
                    name="delivery-option-${matchingProduct.id}">
                  <div>
                    <div class="delivery-option-date">
                      Tuesday, June 21
                    </div>
                    <div class="delivery-option-price">
                      FREE Shipping
                    </div>
                  </div>
                </div>
                <div class="delivery-option">
                  <input type="radio"
                    class="delivery-option-input"
                    name="delivery-option-${matchingProduct.id}">
                  <div>
                    <div class="delivery-option-date">
                      Wednesday, June 15
                    </div>
                    <div class="delivery-option-price">
                      $4.99 - Shipping
                    </div>
                  </div>
                </div>
                <div class="delivery-option">
                  <input type="radio"
                    class="delivery-option-input"
                    name="delivery-option-${matchingProduct.id}">
                  <div>
                    <div class="delivery-option-date">
                      Monday, June 13
                    </div>
                    <div class="delivery-option-price">
                        $9.99 - Shipping
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
    `;
 });

 document.querySelector('.order-summary').innerHTML=cartSummaryHTML ;


 document.querySelectorAll('.js-delete-link')
 .forEach((link)=> {
    link.addEventListener('click',()=>{
        const productId =link.dataset.productId;
        removeFromCart(productId) ;
        //console.log(cart) ;
       const container= document.querySelector(`.js-cart-item-container-${productId}`) ;
       container.remove() ;
       checkoutCount() ;
    });
 });
 checkoutCount() ;

 export function checkoutCount(){
    const countQuantity = calculateCartQuantity() ;
     document.querySelector('.js-checkout-count')
     .innerHTML=`Checkout (<a class="return-to-home-link"
            href="amazon.html">${countQuantity} items</a>)` ;

    
}


document.querySelectorAll('.js-update-link')
.forEach(link=>{
    link.addEventListener('click',()=>{
        const productId = link.dataset.productId ;
        const container = document.querySelector(`.js-cart-item-container-${productId}`) ;
        container.classList.add('is-editing-quantity') ;
        // SWITCHING TO SAVE BUTTON
        


    })
});

document.querySelectorAll(`.save-quantity-link`)
.forEach(link=>{
  link.addEventListener('click',()=>{
    const productId = link.dataset.productId ;
    const container = document.querySelector(`.js-cart-item-container-${productId}`) ;
    const inputLable = document.querySelector(`.js-input-${productId}`) ;

    const newQuantity = Number(inputLable.value) ;
    if(newQuantity >=0 &&newQuantity<1000 ){

      container.classList.remove('is-editing-quantity') ;
    
      updateQuantity(productId,newQuantity) ;
      document.querySelector(`.js-quantity-label-${productId}`)
      .innerHTML = newQuantity ;
      checkoutCount() ;

    }else{
     
      alert('Please enter a valid quantity between 0 and 999') ;
      return;
    }
 
  }) ;

}) ; 

