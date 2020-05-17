module.exports = class State {
    constructor(data, context, meta) {
        this.meta = meta;
        this.data = data;
        this.context = context;
    }

    async handle() {
        throw new Error(`this state is abstract, please use inheritor with 'handle', 'keyboard' and 'message' overwritten`);
    }

    async sendMessage({message, keyboard}) {
        this.context.sendMessage({message, keyboard}, this.data);
    }

    async sendImage({image}) {
        return this.context.sendImage({image}, this.data);
    }

    async sendGame({name, keyboard, State}) {
        return this.context.sendGame({name, keyboard, State}, this.data);
    }

    async transitTo({State, meta}) {
        return this.context.transitTo({State, meta}, this.data);
    }
};
