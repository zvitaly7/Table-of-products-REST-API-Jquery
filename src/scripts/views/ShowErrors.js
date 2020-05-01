export class ShowErrors {
    constructor(){
       this.inputs = {
            name: $('#name-product'),
            email: $('#email-supplier'),
            count: $('#count-product'),
            price: $('#price-product')
        };
    }

    ShowErrorMessages(messages){
        for (var keyInputs in this.inputs) {
            this.HideError($(this.inputs[keyInputs]));
        }
        for (let i = 0; i < messages.length; i++) {
            let msgText = messages[i];
            // parse name field
            let nameField = msgText.slice(msgText.indexOf('*') + 1, msgText.lastIndexOf('*'));
            // parse text error
            let textError = msgText.slice(msgText.lastIndexOf('*') + 1);
            for (keyInputs in this.inputs) {
                if (keyInputs === nameField) {
                    nameField = this.inputs[keyInputs];
                    this.ShowError($(nameField), textError);
                }
            }
            // focus in error field
            if (i === 0) {
                $(nameField).focus();
            }
        }
    }

    HideError($field) {
        $field.css('border-color', '#ccc');
        $field.next().css('display', 'none');
    }

    ShowError($field, text) {
        $field.css('border-color', '#eb7e87');
        $field.next().html(text);
        $field.next().css('color', 'red');
        $field.next().css('display', 'inline-block');
    }

}