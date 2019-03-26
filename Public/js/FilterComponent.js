Vue.component('search', {
    data(){
        return{
            searchString: '',
        }
    },
    template:
        `<form action="#" class="search-form" @submit.prevent="$root.$refs.products.filter(searchString)">
            <input type="text" class="search-field" v-model="searchString" placeholder="Введите название товара" />
            <button class="btn-search" type="submit">
                <i class="fas fa-search"></i>
            </button>
        </form>`
});