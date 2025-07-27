export class AppError extends Error {
    public statusCode;

    constructor(message: string = "An error occured", statusCode: number = 500) {
        super(message || "An error occured!");
        this.statusCode = statusCode;
        this.name = this.constructor.name;
    }
}
