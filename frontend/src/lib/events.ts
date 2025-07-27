type AppAuthStateChangeEventType = {
    isAuthenticated: boolean;
}

export class AppAuthStateChangeEvent extends CustomEvent<AppAuthStateChangeEventType> {
    constructor(options: { isAuthenticated: boolean }) {
        super("authStateChange", { detail: { isAuthenticated: options.isAuthenticated } })
    }
}
