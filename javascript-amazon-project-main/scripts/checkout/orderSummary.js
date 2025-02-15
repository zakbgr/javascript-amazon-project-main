import { products ,getProduct} from '../../data/products.js';
import {cart,
    removeFromCart,
    calculateCartQuantity,
    updateQuantity,
    updateDeliveryOption} from '../../data/cart.js' ;
import formatCurrency  from '../utils/money.js';
//import {hello} from 'https://unpkg.com/supersimpledev@1.0.1/hello.esm.js' ;
import dayjs from 'https://unpkg.com/dayjs@1.11.10/esm/index.js' ;
import {deliveryOptions , getDeliveryOption} from '../../data/deliveryOptions.js' ;
import { renderPaymentSummary } from './paymentSummary.js';



export function renderOrderSummary(){


let cartSummaryHTML='';
 cart.forEach((cartItem)=>{

    const productId = cartItem.productId ;

   /* let matchingProduct ;
    products.forEach((product)=>{
        if(productId === product.id){
            matchingProduct = product ;
        }
    }) ;*/
     let matchingProduct =getProduct(productId) ;
/*
    const deliveryOptionId =  cartItem.deliveryOptionId ;
    let deliveryOption ;

    deliveryOptions.forEach((option)=>{
      if(option.id === deliveryOptionId){
        deliveryOption = option ;
       // console.log('delivery pp ',deliveryOption) ;
      }
    });
    */
   // console.log(deliveryOption.deliveryDays) ;
    let deliveryOption = getDeliveryOption(cartItem.deliveryOptionId) ;

    const today = dayjs() ;
    const dv = deliveryOption.deliveryDays ;
    const deliveryDate = today.add(dv,'days');
    const dateString = deliveryDate.format('dddd , MMMM , D');
   // console.log(deliveryOption.deliveryDays) ;

    cartSummaryHTML+=`  <div class="cart-item-container
    js-cart-item-container-${matchingProduct.id}
    "
    >
            <div class="delivery-date">
              Delivery date: ${dateString}
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
                ${deliveryOptionsHTML(matchingProduct,cartItem)}
              </div>
            </div>
          </div>
    `;
 });

 function deliveryOptionsHTML(matchingProduct, cartItem){

  let html ='' ;
  deliveryOptions.forEach((deliveryOption)=>{
    const today = dayjs() ;
    const deliveryDate = today.add(deliveryOption.deliveryDays,'days');
    const dateString = deliveryDate.format('dddd , MMMM, D');
   // console.log(deliveryOption) ;

    const priceString= deliveryOption.price === 0
     ? 'FREE Shipping' 
     : `$${formatCurrency(deliveryOption.priceCents)} - `
     const isChecked =deliveryOption.id 
     === cartItem.deliveryOptionId ;
     html+=
`
        <div class="delivery-option js-delivery-option"
        data-product-id=${matchingProduct.id}
        data-delivery-option-id="${deliveryOption.id}"
        >
      <input type="radio" 
      ${isChecked ? 'checked' : '' }
        class="delivery-option-input"
        name="delivery-option-${matchingProduct.id}">
      <div>
        <div class="delivery-option-date">
          ${dateString}
        </div>
        <div class="delivery-option-price">
           ${priceString} Shipping
        </div>
      </div>
    </div>` ;

  }) ;
  return html ;
 }
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
       renderPaymentSummary() ;
    });
 });
 checkoutCount() ;

  function checkoutCount(){
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
     
    });
});

document.querySelectorAll(`.save-quantity-link`)
.forEach(link=>{
  link.addEventListener('click',()=>{
    const productId = link.dataset.productId ;
    const container = document.querySelector(`.js-cart-item-container-${productId}`) ;
    const inputLable = document.querySelector(`.js-input-${productId}`) ;

    const newQuantity = Number(inputLable.value) ;
    if(newQuantity >0 &&newQuantity<1000 ){

      container.classList.remove('is-editing-quantity') ;
    
      updateQuantity(productId,newQuantity) ;
      document.querySelector(`.js-quantity-label-${productId}`)
      .innerHTML = newQuantity ;
      checkoutCount() ;
      renderPaymentSummary() ;

    }else{
     
      alert('Please enter a valid quantity between 1 and 999') ;
      return;
    }
 
  }) ;

}) ; 

document.querySelectorAll('.js-delivery-option')
.forEach(Element => {
  Element.addEventListener('click', () => {
    const productId = Element.dataset.productId ;
    const deliveryOptionId = Element.dataset.deliveryOptionId
    updateDeliveryOption(productId, deliveryOptionId) ;
    renderPaymentSummary() ;
    renderOrderSummary(); 
  });
}) ;
}
renderOrderSummary() ;