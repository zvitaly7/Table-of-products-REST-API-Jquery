import {ProductListModel} from "../models/ProductList";
import {ProductRenderer} from "../views/ProductRenderer";
import {App} from "../index";
import {ProductValidator} from "./ProductValidator";

export class ProductController {
    constructor() {
        this.render = new ProductRenderer();
        this.model = new ProductListModel(this.render);
        this.validator = new ProductValidator();
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
    }

    addProduct(e) {

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

    showEditWindow() {
        this.render.RenderAddWindow();
        $('#btnClose').click(this.closeHandler.bind(this));
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

    confirmAddProductHandler(e) {
        e.preventDefault();
        let product = {};

        this.fillDataObj(product);
        if (!this.checkValidator(product)) {

            this.model.addProduct(product);
        } else {
            this.render.ShowErrors(this.validator.validator.messages);
        }
    }

    fillDataObj(obj) {
        obj.name = $('#name-product').val();
        obj.email = $('#email-supplier').val();
        obj.count = $('#count-product').val();
        obj.price = $('#price-product').val();
        obj.delivery = {
            country: "string",
            city: [
                "string"
            ]
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

    sortTable($hideElem, $showElem, fieldSort, productsList) {
        if (this.click) {
            this.click = 0;
            productsList.sort(this.CompareProducts(fieldSort, -1));
            this.render.RenderSort($hideElem, $showElem, fieldSort, productsList, 1);
        } else {
            this.click = 1;
            productsList.sort(this.CompareProducts(fieldSort, 1));
            this.render.RenderSort($hideElem, $showElem, fieldSort, productsList, -1);
        }
    }

    searchProductHandler() {
        let searchInput = $('#products-name').val().toLowerCase();
        let products = [];
        this.model.productlist.Data.forEach(item => {
            if (item.name.includes(searchInput)) {
                products.push(item);
            }
        });
        this.render.RenderList(products);
    }

    CompareProducts(field, order) {
        let len = arguments.length;
        if (len === 0) {
            return (a, b) => (a < b && -1) || (a > b && 1) || 0;
        }
        if (len === 1) {
            switch (typeof field) {
                case 'number':
                    return field < 0 ?
                        ((a, b) => (a < b && 1) || (a > b && -1) || 0) :
                        ((a, b) => (a < b && -1) || (a > b && 1) || 0);
                case 'string':
                    return (a, b) => (a[field] < b[field] && -1) || (a[field] > b[field] && 1) || 0;
            }
        }
        if (len === 2 && typeof order === 'number') {
            return order < 0 ?
                ((a, b) => (a[field] < b[field] && 1) || (a[field] > b[field] && -1) || 0) :
                ((a, b) => (a[field] < b[field] && -1) || (a[field] > b[field] && 1) || 0);
        }
        let fields, orders;
        if (typeof field === 'object') {
            fields = Object.getOwnPropertyNames(field);
            orders = fields.map(key => field[key]);
            len = fields.length;
        } else {
            fields = new Array(len);
            orders = new Array(len);
            for (let i = len; i--;) {
                fields[i] = arguments[i];
                orders[i] = 1;
            }
        }
        return (a, b) => {
            for (let i = 0; i < len; i++) {
                if (a[fields[i]] < b[fields[i]]) return orders[i];
                if (a[fields[i]] > b[fields[i]]) return -orders[i];
            }
            return 0;
        };
    }
}


