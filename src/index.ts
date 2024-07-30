import { getApp } from './app';

const main = async () => {
    const app = await getApp();

    async function closeGracefully(signal: string) {
        console.info(`Received signal to terminate: ${signal}`);

        // shutdown the server
        await app.close();

        process.kill(process.pid, signal);
    }

    process.once('SIGINT', closeGracefully);
    process.once('SIGTERM', closeGracefully);
    
    try {
        await app.listen({ port: app.configs.instance.port, host: '0.0.0.0' });
        console.log("App ready to recive requests");
    } catch (err) {
        console.log(err);
        process.exit(1);
    }
};

main();
