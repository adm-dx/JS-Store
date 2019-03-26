Vue.component('products', {
    data(){
        return {
            products: [],
            filteredProducts: [],
        }
    },
    mounted(){
        this.$parent.getJson(`/api/products`)
            .then(data => {
                for(let el of data){
                    this.products.push(el);
                    this.filteredProducts.push(el);
                }
            })
    },
    methods: {
        filter(value){
            let regexp = new RegExp(value, 'i');
            this.$parent.$refs.products.filteredProducts = this.$parent.$refs.products.products.filter(el => regexp.test(el.product_name));
        },
    },
    template: `
        <div class="catalog-main-content">
            <product v-for="item of filteredProducts" :key="item.id_product" :product="item"></product>
        </div>
    `
});

Vue.component('featuredproducts', {
    data() {
        return{
            featuredProducts: []
        }
    },
    mounted(){
        this.$parent.getJson(`/api/products`)
            .then(data => {
                for(let el of data){
                    if(el.isFeatured === true) {
                        this.featuredProducts.push(el);
                        console.log(this.featuredProducts);
                    }
                }
            })
    },
    template:
        `<div class="featured-items-catalog">
              <product v-for="item of featuredProducts" :key="item.id_product" :product="item"></product>  
        </div>`
});

Vue.component('product', {
    props: ['product'],
    template:
        `<div class="item-to-buy-catalog">
             <a class="item-to-buy-link" href="singlepage.html"> <img class="item-to-buy-image" :src="product.product_image" alt="t-shirt for man">
                 <div class="item-to-buy-text">
                      <p class="item-header">{{product.product_name}}</p>
                      <p class="item-price">&#36;{{product.price.toFixed(2)}}</p>
                 </div>
             </a>
             <div class="hover-add-like-position">
                 <button class="add-to-cart-link" @click="$root.$refs.dropcart.addProduct(product)"><img class="add-to-cart-svg-catalog" src="Img/cart.svg" alt="your cart">Add to cart</button>
                 <div class="refresh-like">
                     <a href="#" class="add-to-cart-refresh-link"><img src="Img/refresh.svg" alt="refresh"></a>
                     <a href="#" class="add-to-cart-like-link"><img src="img/like.svg" alt="like"></a>
                 </div>
             </div>
         </div>`
});