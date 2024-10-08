declare namespace NodeJS {
    interface ProcessEnv {
        MONGODB_PASSWORD: string;
        MONGODB_URI: string;
        JWT_SECRET_KEY: string;
    }
}
