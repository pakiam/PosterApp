const CURRENCY = '$';
const PRICE = 9.99;
const LOAD_NUM = 10;

new Vue({

    el: '#app',
    data: {
        total: 0,
        products: [],
        cart: [],
        searchText: '90s',
        lastSearch: '',
        isLoading: false,
        price: PRICE,
        resultData: []
    },
    mounted(){
        this.search();

        const self = this;

        const elem = document.getElementById('product-list-bottom');
        const watcher = scrollMonitor.create(elem);
        watcher.enterViewport(function () {
            self.appendProducts();
        });
    },
    computed: {
        noMoreItems(){
            return this.products.length === this.resultData.length && this.resultData.length > 0;
        },
    },
    methods: {

        appendProducts(){
            if (this.products.length < this.resultData.length) {
                let append = this.resultData.slice(this.products.length, this.products.length + LOAD_NUM);
                this.products = this.products.concat(append);
            }
        },
        search (){
            if (this.searchText.length) {
                this.isLoading = true;
                this.products = [];
                this.$http
                    .get('/search/'.concat(this.searchText))
                    .then(function (res) {
                        this.lastSearch = this.searchText;
                        this.isLoading = false;
                        this.resultData = res.data;
                        this.appendProducts();

                    });
            }

        },
        addToCart(index){
            let product = this.products[index];
            let found = false;
            this.total += PRICE;
            for (var i = 0; i < this.cart.length; i++) {
                if (this.cart[i].id === product.id) {
                    found = true;

                    this.cart[i].qty++;
                    break;
                }
            }
            if (!found) {
                this.cart.push({
                    id: product.id,
                    title: product.title,
                    price: this.price,
                    qty: 1
                });
            }

        },
        updateCartTotal (){

        },
        inc(item){
            item.qty++;
            this.total += PRICE;
        },
        dec(item){
            if (item.qty <= 1) {
                for (let i = 0; i < this.cart.length; i++) {
                    if (this.cart[i].id === item.id) {
                        this.cart.splice(i, 1);
                        this.total -= PRICE;
                        break;
                    }
                }
            } else {
                this.total -= PRICE;
                item.qty--;
            }

        }
    },
    filters: {
        'currency': function (value) {
            return CURRENCY.concat(value.toFixed(2));
        }
    }
});