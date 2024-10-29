import { app } from "./app";

const PORT = process.env["PORT"] || 5000;

async function main() {
    app.listen(PORT, () => {
        console.log(`Server is running on ${PORT}`);
    });
}

main().catch(err => {
    console.log(err);
    process.exit(1);
});
