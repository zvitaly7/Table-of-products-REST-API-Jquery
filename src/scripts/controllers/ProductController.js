import {ProductRenderer} from "../views/ProductRenderer";
import {ProductValidator} from "./ProductValidator";
import {ProductService} from "../models/ProductService";
import {CompareProducts} from "./CompareProducts";


export class ProductController {
    constructor() {
        this.render = new ProductRenderer();
        this.model = new ProductService(this.render);
        this.validator = new ProductValidator();
        this.comparator = new CompareProducts();
        this.loadData();
        this.$nameElem = $('#name-index, #price-index');
        this.$nameElem.click(this.sortHandler.bind(this));
        this.$searchButton = $('#product-search');
        this.$searchButton.click(this.searchProductHandler.bind(this));
        this.$addButton = $('#showModalWindow');
        this.$addButton.click(this.showAddWindow.bind(this));
        this.$productButton = $('.table-products');
        this.$productButton.on('click', '.delete-product', this.showDeleteWindow.bind(this));
        this.$productButton.on('click', '.edit-product, .product-name', this.showEditWindow.bind(this));
        this.click = 0;
        this.targetID = null;
    }

    loadData() {
        this.model.getData();
    }

    showAddWindow() {
        this.render.RenderAddWindow();
        $('#btnClose').click(this.closeHandler.bind(this));
        $('#btnAddProduct').click(this.confirmAddProductHandler.bind(this));
        $('#count-product').on('change keyup input click', this.pressHandler);
        $('#price-product').focusout(this.formatPriceHandler);
        $('#price-product').focusin(this.formatNumberHandler);
    }

    showDeleteWindow(e) {
        this.targetID = $(e.currentTarget).attr('data-id');
        this.render.RenderDeleteWindow();
        $('#answerYes').click(this.confirmDeleting.bind(this));
        $('#answerNo').click(this.escDeleting.bind(this));
    }

    confirmDeleting() {
        this.model.deleteProduct(this.targetID);
    }

    escDeleting() {
        let deleteWindow = $('#window-product-delete');
        this.render.HideWindow(deleteWindow);
    }

    closeHandler() {
        let addWindow = $('#window-product-add');
        this.render.HideWindow(addWindow);
    }

    showEditWindow(e) {
        this.targetID = $(e.currentTarget).attr('data-id');
        let productData = this.model.productlist.Data[this.findProductIDinTab(this.targetID)];
        this.render.RenderEditWindow(productData);
        this.render.showSelect(productData);
        $('#btnClose').click(this.closeHandler.bind(this));
        $('#btnEditProduct').click(this.confirmEditProduct.bind(this));
        $('#window-product-add input[type=text]').focusout(this.checkValidatorFocusOutHandler.bind(this));
        $('#count-product').on('change keyup input click', this.pressHandler);
        $('#price-product').focusout(this.formatPriceHandler);
        $('#price-product').focusin(this.formatNumberHandler);

    }

    sortHandler() {
        if (this.model.productlist) {
            if (event.currentTarget.id === 'name-index') {
                this.sortTable($('#price-index'), $('#name-index'), 'name', this.model.productlist.Data);
            } else {
                this.sortTable($('#name-index'), $('#price-index'), 'price', this.model.productlist.Data);
            }
        }

    }

    findProductIDinTab(id) {
        let product = null;
        product = this.model.productlist.Data.findIndex(function getId(product) {
            return product.id === id;
        });
        return product;

    }

    confirmEditProduct(e) {
        e.preventDefault();
        let product = {};
        this.fillDataObj(product);
        if (!this.checkValidator(product)) {
            this.model.updateProduct(product, this.targetID);
        } else {
            this.render.errorRender.ShowErrorMessages(this.validator.validator.messages);
        }
    }

    confirmAddProductHandler(e) {
        e.preventDefault();
        let product = {};

        this.fillDataObj(product);
        if (!this.checkValidator(product)) {

            this.model.addProduct(product);
        } else {
            this.render.errorRender.ShowErrorMessages(this.validator.validator.messages);
        }
    }

    fillDataObj(obj) {
        let checkedCity = [];
        $('input:checkbox:checked').each(function () {
            checkedCity.push($(this).val());
        });
        let Country = $('input[type="radio"]:checked').val();
        obj.name = $('#name-product').val();
        obj.email = $('#email-supplier').val();
        obj.count = Number($('#count-product').val());
        obj.price = Number($('#price-product').val().split('$').join('').trim());
        obj.delivery = {
            country: Country,
            city: checkedCity
        };
    }

    checkValidator(product) {
        this.validator.validator.config = {
            id: [],
            delivery: [],
            name: ['isNonEmpty', 'isNonSpace', 'maxLength'],
            email: ['isEmailType', 'isNonEmpty'],
            count: ['isNum'],
            price: ['isNonEmpty', 'isNum']
        };
        this.validator.validator.validate(product);
        return this.validator.validator.hasErrors();

    }

    checkValidatorFocusOutHandler(e) {
        let product = {};
        this.fillDataObj(product);
        if (!this.checkValidator(product)) {
            this.render.errorRender.HideError($(e.currentTarget));
        } else {
            this.render.errorRender.ShowErrorMessages(this.validator.validator.messages);
        }
    }


    sortTable($hideElem, $showElem, fieldSort, productsList) {
        if (this.click) {
            this.click = 0;
            productsList.sort(this.comparator.Compare(fieldSort, -1));
            this.render.RenderSort($hideElem, $showElem, fieldSort, productsList, 1);
        } else {
            this.click = 1;
            productsList.sort(this.comparator.Compare(fieldSort, 1));
            this.render.RenderSort($hideElem, $showElem, fieldSort, productsList, -1);
        }
    }

    searchProductHandler() {
        let searchInput = $('#products-name').val().toLowerCase();
        let products = [];
        this.model.productlist.Data.forEach(item => {
            if (item.name.toLowerCase().includes(searchInput)) {
                products.push(item);
            }
            this.render.RenderList(products);
        });

    }

    pressHandler() {
        if (this.value.match(/[^0-9]/g)) {
            this.value = this.value.replace(/[^0-9]/g, '');
        }
    }

    formatNumberHandler() {
        if (this.value) {
            this.value = this.value.slice(1);
            this.value = parseFloat(this.value.replace(/,/g, '')).toFixed(2);
        }
    }

    formatPriceHandler() {
        if (this.value) {
            let currency = '$';
            return this.value = currency + parseFloat(this.value).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,');

        }
    }


}


