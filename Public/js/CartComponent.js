Vue.component('dropcart', {
    data() {
        return {
            cartUrl: '/getBasket.json',
            basket: [],
            isOpen: false,
        }
    },
    methods: {
        addProduct(product) {
            let find = this.basket.find(el => el.id_product === product.id_product);
            if (find) {
                this.$parent.putJson(`/api/cart/${find.id_product}`, {quantity: find.quantity + 1})
                    .then(data => {
                        if (data.result === 1) {
                            find.quantity++;
                        }
                    })
            } else {
                let prod = Object.assign({quantity: 1}, product);
                this.$parent.postJson(`/api/cart`, prod)
                    .then(data => {
                        if (data.result === 1) {
                            this.basket.push(prod);
                        }
                    })
            }
        },
        remove(item) {
            if (item.quantity > 1) {
                this.$parent.putJson(`/api/cart/${item.id_product}`, {quantity: item.quantity - 1})
                    .then(data => {
                        if (data.result === 1) {
                            item.quantity--;
                        }
                    })
            } else {
                this.$parent.deleteJson(`/api/cart/${item.id_product}`, item)
                    .then(data => {
                        if (data.result === 1) {
                            this.basket.splice(this.basket.indexOf(item), 1);
                        }
                    })
            }
        }
    },
    computed: {
        calcSum() {
            return this.basket.reduce((accum, item) => accum += item.price * item.quantity, 0);
        },
        calcQuantity(){
            return this.basket.reduce((accum, item) => accum += item.quantity, 0);
        }
    },
    mounted() {
        this.$parent.getJson(`/api/cart`)
            .then(data => {
                for (let el of data) {
                    this.basket.push(el);
                }
            });
    },
    template:
        `<div class="cart-position">
            <button class = "dropCartButton"type="button"  @click="isOpen = !isOpen"><img class="yourbag_image" src="Img/yourcart.svg" alt="Your Cart"></button>
                 <div class="dropCartQuantity" v-show="calcQuantity != 0"> {{calcQuantity}} </div>
                 <div class="drop-yourcart" v-show="isOpen">
                      <p v-if="!basket.length">Your cart is Empty <br><br></p>
                      <drop-cart-item class="cart-item"
                        v-for="cartItem of basket" 
                        :key="cartItem.id_product"
                        :cart-item="cartItem"
                        @remove="remove">
                      </drop-cart-item>
                      <div class="drop-cart">
                           <div class="drop-cart-total">
                                <div class="drop-cart-total-header">
                                     <p>total</p>
                                </div>
                                <div class="drop-cart-total-amount">
                                     <p>&#36;{{ calcSum.toFixed(2) }}</p>
                                </div>
                           </div>
                           <div class="drop-cart-button">
                                <a class="drop-cart-button-link" href="checkout.html">checkout</a>
                           </div>
                           <div class="drop-cart-button">
                                <a class="drop-cart-button-link" href="cart.html">go to cart</a>
                           </div>
                      </div>
                 </div>
        </div>`
});

Vue.component('cart', {
    data() {
        return {
            cartUrl: '/getBasket.json',
            basket: [],
            isOpen: false,
        }
    },
    methods: {
        remove(item) {
            if (item.quantity > 1) {
                this.$parent.putJson(`/api/cart/${item.id_product}`, {quantity: item.quantity - 1})
                    .then(data => {
                        if (data.result === 1) {
                            item.quantity--;
                        }
                    })
            } else {
                this.$parent.deleteJson(`/api/cart/${item.id_product}`, item)
                    .then(data => {
                        if (data.result === 1) {
                            this.basket.splice(this.basket.indexOf(item), 1);
                        }
                    })
            }
        },
        removeAll() {
            this.$parent.deleteJson(`/api/cart/all`)
                .then(data => {
                    if (data.result === 1) {
                        this.basket.splice(0, this.basket.length)
                    }
                })
        },
        itemsUpdate(cartItem){
            let find = this.basket.find(el => el.id_product === cartItem.id_product);
            if(cartItem.quantity < 1) {
                cartItem.quantity = -(cartItem.quantity);
                //} else if(cartItem.quantity === 0)
                // if(find) {
                //     this.$parent.deleteJson(`/api/cart/${find.id_product}`, find)
                //         .then(data => {
                //             if (data.result === 1) {
                //                 console.log('ok');
                //                 this.basket.splice(this.basket.indexOf(cartItem), 1);
                //             }
                //         })
                // }
            }
            else {
                if (find) {
                    this.$parent.putJson(`/api/cart/${find.id_product}`, {quantity: find.quantity})
                        .then(data => {
                            if (data.result === 1) {
                                find.quantity = cartItem.quantity;
                            }
                        })
                }
            }
        }
    },
    mounted() {
        this.$parent.getJson(`/api/cart`)
            .then(data => {
                for (let el of data) {
                    this.basket.push(el);
                    console.log(this.calcQuantity);
                }
            });
    },
    computed: {
        calcSum() {
            return this.basket.reduce((accum, item) => accum += item.price * item.quantity, 0);
        },
        calcQuantity(){
            return this.basket.reduce((accum, item) => accum += item.quantity, 0);
        }
    },
    template:
        `<div>
            <div class="cart-position-fullcart">
            <button class = "dropCartButton"type="button"  @click="isOpen = !isOpen"><img class="yourbag_image" src="Img/yourcart.svg" alt="Your Cart"></button>
                 <div class="dropCartQuantity" v-show="calcQuantity != 0"> {{calcQuantity}} </div>
                 <div class="drop-yourcart" v-show="isOpen">
                      <p v-if="!basket.length">Your cart is Empty <br><br></p>
                      <drop-cart-item class="cart-item"
                        v-for="cartItem of basket" 
                        :key="cartItem.id_product"
                        :cart-item="cartItem"
                        @remove="remove">
                      </drop-cart-item>
                      <div class="drop-cart">
                           <div class="drop-cart-total">
                                <div class="drop-cart-total-header">
                                     <p>total</p>
                                </div>
                                <div class="drop-cart-total-amount">
                                     <p>&#36;{{ calcSum.toFixed(2) }}</p>
                                </div>
                           </div>
                           <div class="drop-cart-button">
                                <a class="drop-cart-button-link" href="checkout.html">checkout</a>
                           </div>
                           <div class="drop-cart-button">
                                <a class="drop-cart-button-link" href="cart.html">go to cart</a>
                           </div>
                      </div>
                 </div>
            </div>
            <div class="cart-header">
                <div class="cart-header-left">Product Details</div>
                <div class="cart-header-right">
                    <div class="cart-item-right-content">unit Price</div>
                    <div class="cart-item-right-content">Quantity</div>
                    <div class="cart-item-right-content">shipping</div>
                    <div class="cart-item-right-content">Subtotal</div>
                    <div class="cart-item-right-header">ACTION</div>
                </div>
            </div>
            <p v-if="!basket.length"><br><br>Your cart is Empty <br><br></p>
                <cart-item class="cart-item"
                    v-for="cartItem of basket" 
                    :key="cartItem.id_product"
                    :cart-item="cartItem"
                    @remove="remove">
                </cart-item>
            <div class="container cart-buttons">
                <div class="cart-button"><button class="cart-button-link" @click="removeAll">cLEAR SHOPPING CART</button></div>
                <div class="cart-button"><a href="catalog.html" class="cart-button-link">cONTINUE sHOPPING</a></div>
            </div>
            
            <div class="container cart-bottom-form">
                <div class="cart-delivery-address-form">
                    <form action="#">
                        <p class="cart-bottom-header">Shipping Address</p>
                        <input class="cart-bottom-form-field" type="text" placeholder="Bangladesh">
                        <input class="cart-bottom-form-field" type="text" placeholder="State">
                        <input class="cart-bottom-form-field" type="text" placeholder="Postcode / Zip"></form>
                    <a href="#" class="cart-bottom-button">get a quote</a>
                </div>
                <div class="cart-bottom-coupon">
                    <p class="cart-bottom-header">coupon discount</p>
                    <p class="cart-bottom-text">Enter your coupon code if you have one</p>
                    <form action="#">
                        <input class="cart-bottom-form-field" type="text" placeholder="State">
                        <a href="#" class="cart-bottom-button">Apply coupon</a>
                    </form>
                </div>
                <div class="cart-bottom-block-total">
                    <div class="cart-block-text">
                        <p class="cart-total-small">Sub total &#36;{{ calcSum}}</p>
                        <p class="cart-total-big">GRAND TOTAL <span class="pink"> &#36;{{ calcSum}}</span></p>
                    </div>
                    <div class="cart-button-block">
                        <a href="#" class="cart-total-button">proceed to checkout</a>
                    </div>
                </div>
            </div>
        </div>`
});

Vue.component('drop-cart-item', {
    props: ['cartItem'],
    template:
        `<div class="cart-item">
            <a href="">
                <div class="drop-cart-image-block">
                    <img class="dropCartImg" :src="cartItem.product_image" alt="t-shirt">
                </div>
            </a>
            <div class="drop-cart-text-block">
                <a class="item-cart-header" href="singlepage.html">{{cartItem.product_name}}</a>
                <p class="item-cart-scores">
                    <i class="fa fa-star" aria-hidden="true"></i>
                    <i class="fa fa-star" aria-hidden="true"></i> 
                    <i class="fa fa-star" aria-hidden="true"></i> 
                    <i class="fa fa-star" aria-hidden="true"></i> 
                    <i class="fa fa-star-half-o" aria-hidden="true"></i>
                </p>
                <p class="item-cart-price"> {{cartItem.quantity}} &nbsp;&nbsp;x&nbsp;&nbsp; &#36; {{cartItem.price.toFixed(2)}}  </p>
            </div>
            <div class="delete-from-cart-buttom">
                <button class="delete-from-cart-link" @click="$emit('remove', cartItem)"><i class="fa fa-times-circle" aria-hidden="true"></i></button>
            </div>
        </div>`
});

Vue.component('cart-item', {
    props: ['cartItem'],
    template:
        `<div class="cart-item-content">
                <div class="cart-item-left">
                    <div class="cart-item-content-photo"><img class="cartItemImg" :src="cartItem.product_image" alt="your cart item"></div>
                    <div class="cart-item-content-description"><a class="cart-item-content-header"
                                                                  href="singlepage.html">
                        {{cartItem.product_name}}
                    </a>
                        <p class="cart-content-description-text"><span
                                class="cart-content-description-bold">Color:</span> Red
                            <br> <span class="cart-content-description-bold">Size:</span> Xll </p>
                    </div>
                </div>
                <div class="cart-item-right">
                    <div class="cart-item-right-content">
                        <p class="cart-item-right-text">&#36;{{cartItem.price}}</p>
                    </div>
                    <div class="cart-item-right-content">
                        <form action="#" @submit.prevent="$parent.itemsUpdate(cartItem)">
                            <input class="cart-item-quantity-input" type="number" v-model.lazy.number="cartItem.quantity" ></form>
                    </div>
                    <div class="cart-item-right-content">
                        <p class="cart-item-right-text">free</p>
                    </div>
                    <div class="cart-item-right-content">
                        <p class="cart-item-right-text">&#36; {{cartItem.quantity * cartItem.price}}</p>
                    </div>
                    <div class="cart-item-right-content"><button class="delete-from-cart-link" @click="$emit('remove', cartItem)"><i
                            class="fa fa-times-circle" aria-hidden="true"></i></button></div>
                </div>
            </div>`
});