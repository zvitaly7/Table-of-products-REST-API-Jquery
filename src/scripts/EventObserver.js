export class EventObserver {
    constructor() {
        this.observers = [];
    }


    subscribe(method) {
        this.observers.push(method);
    }

    unsubscribe(method) {
        this.observers = this.observers.filter((subscriber) => subscriber !== method);
    }

    broadcast(data) {
        this.observers.forEach((subscriber) => subscriber(data));
    }

}